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
mongoose.connect(configDb.mongodbUri, configDb.options, function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start mongod.')
        process.exit(0)
    } else {
        console.log('Connected to MongoDB successfully!')
    }
})

// IO functions
let numUsers = 0
io.on('connection', (client) => {
    // ----- Handle Users connections ----- //
    controller.boards.getAllBoards(client)

    numUsers++
    client.broadcast.emit('connectedUser', numUsers)

    client.emit('connectedUser', numUsers)

    client.on('disconnect', ()=>{
        numUsers--
        client.broadcast.emit('connectedUser', numUsers)
    })

    //Update state of the new user
    client.emit('connectedUser', numUsers)

    // ----- Handle Boards ----- //
    client.on('newList', (idBoard, pos)=>
        controller.boards.createList(client, idBoard, pos))
    
    client.on('deleteLists', (idBoard)=>
        controller.boards.deleteAllLists(client, idBoard))
    
    // ----- Handle lists ----- //

    client.on('newCardClient', (newCard, idList) => {
        client.broadcast.emit('addEmptyCard', newCard, idList)
    })

    client.on('deleteAllCards', (idList) => {
        client.broadcast.emit('deleteCards', idList)
    })

    client.on('updateListTitle', (idList, newTitle) => {  
        client.broadcast.emit('updateListTitle', idList, newTitle)
    })

    client.on('newBoard', (titleBoard) => {
        controller.boards.createBoard(client,titleBoard)
    })

    client.on('deleteBoard', (idBoard) => {
        controller.boards.deleteBoard(client,idBoard)
    })
})

// Server start
const port = process.env.PORT || 8000
server.listen(port)
console.log('The server is running on:', port)
