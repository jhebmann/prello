var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

//Database declaration
var mongoose = require('mongoose'),
    Card = require('./cardModel'); //created model loading here
mongoose.connect('mongodb://localhost:27017/Cards');
var mongodbUri = "mongodb://localhost:27017/test";
var options = {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
};
var db = mongoose.connect(mongodbUri, options);
var listController =  require('./cardController.js');
cardModel = mongoose.model('Cards');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var numUsers=0;

io.on('connection', (client) => {
    console.log('Client connected...');
    ++numUsers;
    cardModel.find({}, function (err, doc){//Get cards and emit event to the new user connected
        client.emit('initialize',doc); 
      });
     
    client.on('disconnect', function(){
        console.log('User disconnected');
        --numUsers;
        client.broadcast.emit('connectedUser', numUsers);//Update connectedUser number on all clients        
    });

    client.on('newCardClient', function(card){//When a client adds new card, emit to all the connected users and save it
        console.log('New Card');
        client.broadcast.emit('newCard', card);
        var new_card = new Card(card);
        new_card.save(function(err, card) {
        if (err)
            console.log('Error adding New Card mongo',err);
        console.log('Added New Card mongo');
        });    
    });

    //Update state of the new user
    client.on('newUser', function(){
        console.log('New User');
        client.emit('connectedUser', numUsers);    
    });

    //Update state of all connected users
    console.log('Broadcast Connect');
    client.broadcast.emit('connectedUser', numUsers);
});

//External Routes BackEnd (Testing only for now) 
app.route('/').get(listController.list_all_cards).post(listController.create_a_card);
app.route('/delete_collection').delete(listController.delete_collection);

const port = 8000;
server.listen(port);
console.log('listening on port ', port);