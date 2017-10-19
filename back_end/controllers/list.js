'use strict';
const models = require('../models/index')

exports.getAllLists = (client, db)=> {
  db.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
      client.emit('initialize',doc); 
  });
}

exports.deleteList=(client,db,idList)=>{
  db.findOneAndDelete({_id:idList},
    function (err, managerparent) {
        if (err) throw err;
    }
  );
  client.broadcast.emit('deleteList',idList);
}

exports.deleteCardFromList=(client,db,idCard, idList)=>{
  db.findOneAndUpdate({_id:idList, "cards._id":idCard},
    {$pull: {cards:{_id:idCard}}},
    function (err, managerparent) {
        if (err) throw err;
    }
  );
  client.broadcast.emit('deleteCard',idCard, idList);
}

exports.deleteAllCardsFromList=(client,db,idList)=>{
  db.findOneAndUpdate({_id:idList},
    { "cards": [] } ,
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
    }
  );
  client.broadcast.emit('changeList',[],idList);
}

exports.createList=(client)=>{
  const newList=new models.lists();
  newList.save({}, (err, insertedList)=> {
    if (err)
      console.log('Error adding List',err);
    else {
      console.log('List Added');
      client.emit('addEmptyList',insertedList._id);
      client.broadcast.emit('addEmptyList',insertedList._id);
    }
  });
}

exports.moveCardToNewList=(client,db,idCard,idOldList,idNewList)=>{
  const card = db.findOne({_id:idOldList, "cards._id":idCard}, {"cards.$":1},
    function (err, managerparent) {
      if (err) throw err;
    }
  )
  db.findOneAndUpdate({_id:idNewList}, {$push: {"cards": card}},
    function (err, managerparent) {
      if (err) throw err;
    }
  )
  db.findOneAndDelete({_id:idOldList, "cards._id":idCard},
    function (err, managerparent) {
      if (err) throw err;
    }
  )
  client.broadcast.emit('moveCard',idCard,idOldList,idNewList);
}

exports.deleteAllLists=(req, res)=>{
  models.lists.remove({}, function(err, card) {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Collection successfully deleted' });
  });
  req.app.get('socketio').emit('deleteAllLists');
}