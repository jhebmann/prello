const express = require('express')
const app = express()
const helmet = require('helmet')
const router = express.Router()
const passport = require('passport');
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
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
/*
// pass the authenticaion checker middleware
const authCheckMiddleware = require('./routes/api/authCheck');
app.use('/api', authCheckMiddleware);
*/
// routes
const authRoutes = require('./routes/api/auth');
app.use('/auth', authRoutes);
app.use('/api', require('./routes'))

// Database declaration
const mongoose = require('mongoose')
const configDb = require('./config/database')
mongoose.Promise = global.Promise

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
    client.on('newBoard', (board,teamId) => {
        client.broadcast.emit('addBoard', board,teamId)
    })
    client.on('newTeam', (team) => {
        client.broadcast.emit('addTeam', team)
    })
    client.on('deleteBoard', (idBoard) => {
        client.broadcast.emit('deleteBoard', idBoard)
    })
    
    // ----- Handle lists ----- //
    client.on('newList', (newList, idBoard)=> {
        client.broadcast.emit('addList', newList, idBoard)
    })
    
    client.on('updateListTitle', (idList, newTitle) => {  
        client.broadcast.emit('updateListTitle', idList, newTitle)
    })

    client.on('deleteLists', (idBoard) => {
        controller.boards.deleteAllLists(client, idBoard)
    })

    // ----- Handle cards ----- //
    client.on('newCard', (newCard, idList) => {
        client.broadcast.emit('addCard', newCard, idList)
    })
    
    client.on('deleteAllCards', (idList) => {
        client.broadcast.emit('deleteCards', idList)
    })

    client.on('updateCardServer', (card) => {
        client.broadcast.emit('updateCardClient', card)
    })
})

// Server start
const port = process.env.PORT || 8000
server.listen(port)
console.log('The server is running on:', port)
