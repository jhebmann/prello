const models = require('../models/index.js');

exports.getAllCards = (client, db)=> {
    db.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
        client.emit('initialize',doc); 
    });
}

exports.saveNewCard=(client,db,card,idList)=>{
    client.broadcast.emit('newCard', card, idList);
    db.findOneAndUpdate({idList:idList},
        { "$push": { "cards": card } },
        { "new": true, "upsert": true },
        function (err, managerparent) {
            if (err) throw err;
        }
    );
}

exports.deleteList=(client,db,idList)=>{
    db.findOneAndUpdate({idList:idList},
    { "cards": [] } ,
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
    }
    );
    client.broadcast.emit('changeList',[],idList);
}

exports.createList=(client,idList)=>{
    const newList=new models.Lists();
    newList.idList=idList;
    newList.save({}, (err)=> { //For now delete all the cards from database
    if (err)
        console.log('Error adding List',err);
    console.log('List Added');
    });
    client.broadcast.emit('addEmptyList',idList);
}