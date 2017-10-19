'use strict';
const models = require('../models/index')

exports.deleteAllCards=(client,db,idList)=>{
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
  const newList=new models.lists();
  newList.idList=idList;
  newList.save({}, (err)=> { //For now delete all the cards from database
    if (err)
      console.log('Error adding List',err);
    else
      console.log('List Added');
  });
  client.broadcast.emit('addEmptyList',idList);
}