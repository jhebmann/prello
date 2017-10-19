const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.set('socketio', io);

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

//Database declaration
const mongoose = require('mongoose')
const configDb = require('./config/database')
mongoose.connect(configDb.mongodbUri, configDb.options)
require('./config/passport')(passport)

const models = require('./models/index')
const listModel = models.lists

const controller = require('./controllers/index.js')

app.use(morgan('dev'))
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
    controller.lists.getAllLists(client,listModel)
    numUsers++;
    client.broadcast.emit('connectedUser', numUsers); 
    

    client.on('disconnect', ()=>{
        numUsers--;
        client.broadcast.emit('connectedUser', numUsers);        
    });

    client.on('newCardClient', (card,idList)=>
        controller.cards.createCard(client,listModel,card,idList))

    client.on('deleteAllCards', (idList)=>{
        controller.lists.deleteAllCardsFromList(client,listModel,idList);
    });    

    client.on('newList', (id)=>{
        controller.lists.createList(client,id)
    });

    //Update state of the new user
    client.on('newUser', ()=>
        client.emit('connectedUser', numUsers));
});

//External Routes BackEnd (Testing only for now) 
//app.use('/', controller)
app.route('/').get(controller.lists.getAllLists).post(controller.cards.createCard);
app.route('/deleteAll').delete(controller.lists.deleteAllLists);

const port = process.env.PORT || 8000;
server.listen(port);
console.log('listening on port ', port);
