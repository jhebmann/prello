const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const controller = require('./controllers/index.js')
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

const listModel = models.lists
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let numUsers = 0

io.on('connection', (client) => {
    controller.cards.getAllCards(client,listModel)
    numUsers++;
    client.broadcast.emit('connectedUser', numUsers); 
    

    client.on('disconnect', ()=>{
        numUsers--;
        client.broadcast.emit('connectedUser', numUsers);        
    });

    client.on('newCardClient', (card,idList)=>
        controller.cards.createCard(client,listModel,card,idList))

    client.on('deleteAllCards', (idList)=>{
        controller.lists.deleteAllCards(client,listModel,idList);
    });    

    client.on('newList', (idList)=>{
        controller.lists.createList(client,idList)
    });

    //Update state of the new user
    client.on('newUser', ()=>
        client.emit('connectedUser', numUsers));
});

//External Routes BackEnd (Testing only for now) 
//app.use('/', controller)
app.route('/').get(controller.cards.getAllCards).post(controller.cards.createCard);
//app.route('/deleteAll').delete(controller.cards.deleteAll);

const port = 8000;
server.listen(port);
console.log('listening on port ', port);
