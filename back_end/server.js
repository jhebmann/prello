const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')

//Database declaration
const mongoose = require('mongoose')
const configDb = require('./config/database')
mongoose.connect(configDb.mongodbUri, configDb.options)
require('./config/passport')(passport)

const models = require('./models/index')
const listModel = models.lists

const eventController = require('./controllers/event')
const cardController =  require('./controllers/card')


app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({secret: 'banane34',
                saveUninitialized: true,
                resave: true}))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


let numUsers = 0

io.on('connection', (client) => {
    eventController.getAllCards(client,listModel)
    ++numUsers;
    client.broadcast.emit('connectedUser', numUsers); 
    

    client.on('disconnect', ()=>{
        --numUsers;
        client.broadcast.emit('connectedUser', numUsers);        
    });

    client.on('newCardClient', (card,id)=>
        eventController.saveNewCard(client,listModel,card,id))

    client.on('deleteList', (id)=>{
        eventController.deleteList(client,listModel,id);

    });    

    client.on('newList', (id)=>{
        eventController.createList(client,id)

    });

    //Update state of the new user
    client.on('newUser', ()=>
        client.emit('connectedUser', numUsers));
});

//External Routes BackEnd (Testing only for now) 
app.route('/').get(cardController.findAll).post(cardController.add);
app.route('/deleteAll').delete(cardController.deleteAll);

const port = 8000;
server.listen(port);
console.log('listening on port ', port);
