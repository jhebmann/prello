const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const eventController = require('./controllers/event.js')
const models = require('./models/index')

//Database declaration
const mongoose = require('mongoose')

const mongodbUri = "mongodb://localhost:27017/test"
const options = {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
}
const db = mongoose.connect(mongodbUri, options)

const cardController =  require('./controllers/card.js')
const listModel = models.lists
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
