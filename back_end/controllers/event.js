const models = require('../models/index.js');

exports.getAllCards = (client, db)=> {
    db.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
        client.emit('initialize',doc); 
    });
}

exports.saveNewCard=(client,db,card,_id)=>{
    client.broadcast.emit('newCard', card, _id);
    db.findOneAndUpdate({_id:_id},
        { "$push": { "cards": card } },
        { "new": true, "upsert": true },
        function (err, managerparent) {
            if (err) throw err;
        }
    );
}

exports.deleteList=(client,db,_id)=>{
    db.findOneAndUpdate({_id:_id},
    { "cards": [] } ,
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
    }
    );
    client.broadcast.emit('changeList',[],_id);
}

exports.createList=(client)=>{
    const newList=new models.lists();
    newList.save({}, (err)=> { //For now delete all the cards from database
    if (err)
        console.log('Error adding List',err);
    console.log('List Added');
    });
    console.log(newList)
    client.broadcast.emit('addEmptyList',newList._id);
}