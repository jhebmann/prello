const models = require('../models/index.js');

exports.getAllCards = (client, db)=> {
    db.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
        client.emit('initialize',doc); 
    });
}

exports.saveNewCard=(client,db,card,id)=>{
    client.broadcast.emit('newCard', card, id);
    db.findOneAndUpdate({id:id},
        { "$push": { "cards": card } },
        { "new": true, "upsert": true },
        function (err, managerparent) {
            if (err) throw err;
        }
    );
}

exports.deleteList=(client,db,id)=>{
    db.findOneAndUpdate({id:id},
    { "cards": [] } ,
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
    }
    );
    client.broadcast.emit('changeList',[],id);
}

exports.createList=(client, id)=>{
    const newList=new models.lists();
    newList.id = id
    newList.save({}, (err)=> { //For now delete all the cards from database
    if (err)
        console.log('Error adding List',err);
    console.log('List Added');
    });
    client.broadcast.emit('addEmptyList',id);
}