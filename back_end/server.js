const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const models = require('./models/index')

//Database declaration
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Lists', {
    useMongoClient: true
  })

const mongodbUri = "mongodb://localhost:27017/test";
const options = {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
};
const db = mongoose.connect(mongodbUri, options);
const listController =  require('./routes/Card/cardController.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let numUsers=0;

io.on('connection', (client) => {
    console.log('Client connected...');
    ++numUsers;
    models.Lists.find({}, (err, doc)=>{//Get cards and emit event to the new user connected
        client.emit('initialize',doc); 
    });
     
    client.on('disconnect', ()=>{
        console.log('User disconnected');
        --numUsers;
        client.broadcast.emit('connectedUser', numUsers);//Update connectedUser number on all clients        
    });

    client.on('newCardClient', (card,id_list)=>{//When a client adds new card, emit to all the connected users and save it
        client.broadcast.emit('newCard', card, id_list);
        models.Lists.findOneAndUpdate({id_list:id_list},
            { "$push": { "cards": card } },
            { "new": true, "upsert": true },
            function (err, managerparent) {
                if (err) throw err;
                console.log(managerparent);
            }
        );
    });

    client.on('deleteList', (id_list)=>{
        models.Lists.findOneAndUpdate({id_list:id_list},
            { "cards": [] } ,
            { "new": true, "upsert": true },
            function (err, managerparent) {
                if (err) throw err;
                console.log(managerparent);
            }
        );
        client.broadcast.emit('changeList',[],id_list);
    });    


    client.on('newList', (id_list)=>{
        const newList=new models.Lists();
        newList.id_list=id_list;
        newList.save({}, (err)=> { //For now delete all the cards from database
        if (err)
            console.log('Error adding List',err);
        console.log('List Added');
        });
        client.broadcast.emit('addEmptyList',id_list);
    });

    //Update state of the new user
    client.on('newUser', ()=>{
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