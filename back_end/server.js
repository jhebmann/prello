const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const eventController = require('./controllers/eventController.js')
const models = require('./models/index')

//Database declaration
const mongoose = require('mongoose')

const mongodbUri = "mongodb://localhost:27017/test";
const options = {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
};
const db = mongoose.connect(mongodbUri, options);
const listController =  require('./controllers/cardController.js');
const listModel = models.Lists
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let numUsers=0;

io.on('connection', (client) => {
    eventController.get_all_cards(client,listModel)
    ++numUsers;
    client.broadcast.emit('connectedUser', numUsers); 
    

    client.on('disconnect', ()=>{
        --numUsers;
        client.broadcast.emit('connectedUser', numUsers);        
    });

    client.on('newCardClient', (card,id_list)=>
        eventController.save_new_card(client,listModel,card,id_list))

    client.on('deleteList', (id_list)=>{
        eventController.delete_list(client,listModel,id_list);

    });    

    client.on('newList', (id_list)=>{
        eventController.create_list(client,id_list)

    });

    //Update state of the new user
    client.on('newUser', ()=>
        client.emit('connectedUser', numUsers));
});

//External Routes BackEnd (Testing only for now) 
app.route('/').get(listController.list_all_cards).post(listController.create_a_card);
app.route('/delete_collection').delete(listController.delete_collection);

const port = 8000;
server.listen(port);
console.log('listening on port ', port);
