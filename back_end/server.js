const express = require('express')
const app = express()
const helmet = require('helmet')
const router = express.Router()
const passport = require('passport')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.set('socketio', io)
const bodyParser = require('body-parser')

// Preparing app
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet())

// Getting models
const models = require('./models/index')
const listModel = models.lists

// API routes
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*')
 res.setHeader('Access-Control-Allow-Credentials', 'true')
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')

//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache')
 next()
})
// pass the passport middleware
app.use(passport.initialize())

// load passport strategies
const localSignupStrategy = require('./passport/local-signup')
const localLoginStrategy = require('./passport/local-login')
passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localLoginStrategy)

const authRoutes = require('./routes/auth/auth')
app.use('/auth', authRoutes)

// pass the authentication checker middleware
const authCheckMiddleware = require('./routes/auth/authCheck')
app.get('/api/*', authCheckMiddleware)
app.post('/api/*', authCheckMiddleware)
app.put('/api/*', authCheckMiddleware)
app.delete('/api/*', authCheckMiddleware)

// routes
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
io.on('connection', (client) => {

    // ----- Handle Boards ----- //
    client.on('newBoard', (board,teamId) => {
        client.broadcast.emit('addBoard', board,teamId)
    })

    client.on('updateBoardTitle', (id, newTitle) => {
        client.broadcast.emit('updateBoardTitle', id, newTitle)
    })

    client.on('updateBoardServer', (board) => {
        client.broadcast.emit('updateBoardClient', board)
    })

    client.on('deleteBoard', (idBoard) => {
        client.broadcast.emit('deleteBoard', idBoard)
    })

    // ----- Handle Teams ----- //
    client.on('newTeam', (team) => {
        client.broadcast.emit('addTeam', team)
    })

    client.on('deleteTeamServer', (teamId) => {
        client.broadcast.emit('deleteTeamClient', teamId)
    })

    // ----- Handle lists ----- //
    client.on('newList', (newList, idBoard)=> {
        client.broadcast.emit('addList', newList, idBoard)
    })

    client.on('updateListTitle', (idList, newTitle) => {
        client.broadcast.emit('updateListTitle', idList, newTitle)
    })

    client.on('deleteListServer', (idList) => {
        client.broadcast.emit('deleteListClient', idList)
        client.emit('deleteListClient', idList)
    })

    // ----- Handle cards ----- //
    client.on('newCard', (newCard, idList) => {
        client.broadcast.emit('addCard', newCard, idList)
        client.emit('addCard', newCard, idList)
    })

    client.on('deleteAllCards', (idList) => {
        client.broadcast.emit('deleteCards', idList)
        client.emit('deleteCards', idList)
    })

    client.on('updateCardServer', (card) => {
        client.broadcast.emit('updateCardClient', card)
    })

    client.on('deleteCardServer', (cardId, listId) => {
        client.broadcast.emit('deleteCardClient', cardId, listId)
        client.emit('deleteCardClient', cardId, listId)
    })

    // ----- Handle checklist ----- //
    client.on('newChecklistServer', (checklist, cardId) => {
        client.broadcast.emit('newChecklistClient', checklist, cardId)
    })

    client.on('updateChecklistTitleServer', (checklist) => {
        client.broadcast.emit('updateChecklistTitleClient', checklist)
        client.emit('updateChecklistTitleClient', checklist)
    })

    client.on('deleteChecklistServer', (checklistId) => {
        client.broadcast.emit('deleteChecklistClient', checklistId)
    })

    // ----- Handle items ----- //
    client.on('postItemServer', (newItem, checklistId) => {
        client.broadcast.emit('postItemClient', newItem, checklistId)
    })

    client.on('updateItemServer', (newItem, checklistId) => {
        client.broadcast.emit('updateItemClient', newItem, checklistId)
    })

    client.on('deleteItemServer', (itemId, checklistId) => {
        client.broadcast.emit('deleteItemClient', itemId, checklistId)
    })

    // ----- Handle attachments ----- //
    client.on('newAttachmentServer', (attachment) => {
        client.broadcast.emit('newAttachmentClient', attachment)
    })

    client.on('deleteAttachmentServer', (attachmentId) => {
        client.broadcast.emit('deleteAttachmentClient', attachmentId)
    })

    client.on('updateAttachmentTitleServer', (attachment) => {
        client.broadcast.emit('updateAttachmentTitleClient', attachment)
        client.emit('updateAttachmentTitleClient', attachment)
    })

    client.on('deleteAttachmentServer', (attachmentId) => {
        client.broadcast.emit('deleteAttachmentClient', attachmentId)
    })

})

// Server start
const port = process.env.PORT || 8000
server.listen(port)
console.log('The server is running on:', port)
