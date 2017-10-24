'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const boards = models.boards

exports.createBoard=(client,titleBoard)=>{
  const newBoard=new boards({title:titleBoard});
  newBoard.save(
    {},
    (err, insertedBoard) => {
      if (err)
        console.log('Error adding List',err);
      else {
        console.log('Board Added');
        client.emit('addEmptyBoard',insertedBoard._id,titleBoard);
        client.broadcast.emit('addEmptyBoard',insertedBoard._id,titleBoard);
      }
    }
  );
}

exports.getAllBoards= (client)=> {
  boards.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
      client.emit('getAllBoards',doc); 
      console.log(err)
  });
}

exports.getAllLists = (client, idBoard) => {
  boards.find(
    {_id:idBoard},
    {"lists":1, _id: 0},
    function (err, res) {
        if (err) throw err;
        client.emit('getAllLists', res)
    }
  )
}

exports.getList = (client, idList, idBoard) => {
  boards.findOne(
    {_id:idBoard, "lists._id":idList},
    {"lists.$":1, _id: 0},
    function (err, res) {
        if (err) throw err;
        client.emit('getList', res)
    }
  )
}

exports.deleteBoard = (client, idBoard) => {
  boards.findOneAndDelete(
    {_id:idBoard},
    function (err, res) {
        if (err) throw err;
        client.broadcast.emit('deleteBoard', idBoard);
    }
  );
}

exports.deleteList = (client, idList, idBoard) => {
  boards.findOneAndUpdate(
    {_id:idBoard},
    {$pull: {"lists": idList}},
    function (err, res) {
        if (err) throw err;
        client.broadcast.emit('deleteList', idBoard, idList);
    }
  );
}

exports.deleteAllLists = (client, idBoard) => {
  boards.findOneAndUpdate(
    {_id:idBoard},
    {lists: []},
    function (err, res) {
      if (err)
        console.log('Error adding List',err);
      else {
        console.log('All lists of board ' + idBoard + " were deleted")
        client.emit('deleteAllLists', idBoard);
        client.broadcast.emit('deleteAllLists', idBoard);
      }
    }
  );
}

exports.createList=(client, idBoard, pos) => {
  const newList=new models.lists({_id: mongoose.Types.ObjectId(), pos: pos});
  boards.findOneAndUpdate(
    {_id: idBoard},
    {$push: {lists: newList}},
    (err, res) => {
      if (err)
        console.log('Error adding List',err);
      else {
        console.log('List ' + newList._id +' added on board ' + idBoard);
        client.emit('addEmptyList', newList._id, idBoard);
        client.broadcast.emit('addEmptyList', newList._id, idBoard);
      }
    }
  );
}

exports.deleteAll=(req, res)=>{
  boards.remove({}, function(err, card) {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Collection successfully deleted' });
  });
  req.app.get('socketio').emit('deleteAll');
}