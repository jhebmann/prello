'use strict';
const models = require('../models/index')

exports.deleteAllCards=(client,db,idList)=>{
  db.findOneAndUpdate({id:idList},
    { "cards": [] } ,
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
    }
  );
  client.broadcast.emit('changeList',[],idList);
}

exports.createList=(client,id)=>{
  const newList=new models.lists();
  newList.id=id;
  newList.save({}, (err)=> {
    if (err)
      console.log('Error adding List',err);
    else
      console.log('List Added');
  });
  client.broadcast.emit('addEmptyList',id);
}

exports.deleteAll=(client, db)=>{
  models.lists.remove({}, function(err, card) {
    if (err){
      console.log('problems')
      //res.send(err);
    }
    //res.json({ message: 'Collection successfully deleted' });
  });
}