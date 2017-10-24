'use strict';

exports.updateCard = (client, db, idCard, title = null, desc = null, dueDate = null, doneDate = null, isArchived = null) => {
  let newObj = {}
  if (title) newObj.title = title
  if (desc) newObj.description = desc
  if (dueDate) newObj.dueDate = dueDate
  if (doneDate) newObj.doneDate = doneDate
  if (isArchived) newObj.isArchived = isArchived
  db.findOneAndUpdate(
    {_id:idCard},
    {$set: {newObj}},
    function (err, managerparent) {
        if (err) throw err;
    }
  );
  client.broadcast.emit('updateCard');
}

exports.addComment = (client, db, idCard, comment) => {
  db.findOneAndUpdate(
    {_id: idCard},
    {$push: {comments: comment}}
  )
  client.broadcast.emit("newComment")
}

exports.addAttachment = (client, db, idCard, attachment) => {
  db.findOneAndUpdate(
    {_id: idCard},
    {$push: {attachments: attachment}}
  )
  client.broadcast.emit("newAttachment")
}

exports.addCheckList = (client, db, idCard, checklist) => {
  db.findOneAndUpdate(
    {_id: idCard},
    {$push: {checklists: checklist}}
  )
  client.broadcast.emit("newChecklist")
}

exports.addLabel = (client, db, idCard, idLabel) => {
  db.findOneAndUpdate(
    {_id: idCard},
    {$push: {labels: idLabel}}
  )
  client.broadcast.emit("newLabel")
}

//TO KEEP ?
exports.setTitle = (client, db, idCard, title)=>{
  updateCard(client, db, idCard, title)
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