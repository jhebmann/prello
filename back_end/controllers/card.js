'use strict';

exports.getAllCards = (client, db)=> {
  db.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
      client.emit('initialize',doc); 
  });
}

exports.createCard = (client,db,card,idList)=>{
  client.broadcast.emit('newCard', card, idList);
  db.findOneAndUpdate({idList:idList},
      { "$push": { "cards": card } },
      { "new": true, "upsert": true },
      function (err, managerparent) {
          if (err) throw err;
      }
  );
}



/*
router.get('/findAll', function(req, res) {
  lists.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
})

router.get('/add', function(req, res) {
  console.log(req.body);  
  const newList = new lists(req.body);
  newList.save(function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
})

router.get('/deleteAll', function(req, res) {
  lists.remove({}, function(err, card) {
    if (err){
      console.log('problems')
      res.send(err);
    }
    res.json({ message: 'Collection successfully deleted' });
  });
})

module.exports = router*/