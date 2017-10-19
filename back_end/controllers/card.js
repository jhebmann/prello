'use strict';

exports.createCard = (client,db,card,idList)=>{
  db.findOneAndUpdate({id:idList},
      { "$push": { "cards": card } },
      { "new": true, "upsert": true },
      function (err, managerparent) {
          if (err) throw err;
      }
  );
  client.broadcast.emit('addEmptyCard', card, idList);
}

exports.updateCard=(client,db,idCard,idList,newCard)=>{
  db.findOneAndUpdate({id:idList, "cards.id":idCard},
    {$set: {"cards.$": newCard}},
    function (err, managerparent) {
        if (err) throw err;
    }
  );
  client.broadcast.emit('updateCard',newCard.id,idList);
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