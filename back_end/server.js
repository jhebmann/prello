const express = require('express')
const app = express()
const helmet = require('helmet')
const router = express.Router()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.set('socketio', io);
const bodyParser = require('body-parser')

// Preparing app
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet())

// Getting models
const models = require('./models/index')
const listModel = models.lists

// Getting controllers
const controller = require('./controllers/index.js')

// API routes
//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
})

app.use('/api', require('./routes'))

// Database declaration
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const configDb = require('./config/database')
mongoose.connect(configDb.mongodbUri, configDb.options)

// IO functions
let numUsers = 0
io.on('connection', (client) => {
    controller.boards.getAllBoards(client)

    numUsers++
    client.broadcast.emit('connectedUser', numUsers)

    client.emit('connectedUser', numUsers)

    client.on('disconnect', ()=>{
        numUsers--
        client.broadcast.emit('connectedUser', numUsers)
    })

    // ----- Handle Boards ----- //
    client.on('newList', (idBoard, pos)=>
        controller.boards.createList(client, idBoard, pos))
    
    client.on('deleteLists', (idBoard)=>
        controller.boards.deleteAllLists(client, idBoard))

    client.on('getLists', (idBoard)=>
        controller.boards.getAllLists(client, idBoard))
    
    // ----- Handle lists ----- //
        
    client.on('getCards', (idList, idBoard)=>
        controller.lists.getAllCards(client, idList, idBoard))

    client.on('newCardClient', (titleCard, idList, idBoard)=>
        controller.lists.addCard(client, titleCard, idList, idBoard))

    client.on('deleteAllCards', (idList, idBoard)=>
        controller.lists.deleteAllCardsFromList(client, idList, idBoard))

    client.on('updateListTitle', (idBoard, idList, newTitle)=> {
        client.emit('UpdateListTitle', idList, newTitle),
        client.broadcast.emit('UpdateListTitle', idList, newTitle)
    })

    client.on('newBoard', (titleBoard)=>{
        controller.boards.createBoard(client,titleBoard)
    })

    client.on('deleteBoard', (idBoard)=>{
        controller.boards.deleteBoard(client,idBoard)
    })

    //Update state of the new user
    client.emit('connectedUser', numUsers)
})

//External Routes BackEnd (Testing only for now) 
//app.use('/', controller)
/*app.route('/').get(controller.users.getAllBoards)
app.route('/board/:id').get(controller.boards.getAllLists).post(controller.lists.addCard);
app.route('/deleteAll').delete(controller.boards.deleteAll);*/

// Server start
const port = process.env.PORT || 8000
server.listen(port)
console.log('The server is running on: ', port)
