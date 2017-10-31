'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const boards = models.boards

exports.deleteCardFromList=(client, idCard, idList, idBoard)=>{
  boards.findOneAndUpdate(
    {_id:idBoard, "boards.lists._id":idList},
    {$pull: {"boards.lists.cards":{_id:idCard}}},
    function (err, res) {
        if (err) throw err;
        client.broadcast.emit('deleteCard', idCard, idList, idBoard);
    }
  );
}

exports.deleteAllCardsFromList=(client, idList, idBoard)=>{
  boards.findOneAndUpdate(
    {_id:idBoard, lists: {$elemMatch: {_id: idList}}},
    {"lists.$.cards": []},
    function (err, res) {
        if (err) throw err;
        console.log("Deleted all cards from list " + idList + " on board " + idBoard)
        client.emit('deleteCards', idList, idBoard)
        client.broadcast.emit('deleteCards', idList, idBoard);
    }
  );
}

exports.moveCardToNewList=(client, idCard, idOldList, idNewList, idBoard)=>{
  boards.findOneAndUpdate(
    {_id:idBoard, "lists._id": idNewList},
    {$push: {"lists.$.cards": idCard}},
    function (err, managerparent) {
      if (err) throw err;
    }
  )
  boards.findOneAndUpdate(
    {_id:idBoard, "lists._id": idOldList}, 
    {$pull: {"lists.$.cards":idCard}},
    function (err, managerparent) {
      if (err) throw err
    }
  )
  client.broadcast.emit('moveCard', idCard, idOldList, idNewList, idBoard);
}

exports.updateList = (client, idBoard, idList, newTitle) => {
  boards.findOneAndUpdate(
    {_id:idBoard, lists: {$elemMatch: {_id: idList}}},
    {"lists.$.title": newTitle},
    function (err, res) {
        if (err) throw err;
        client.emit('UpdateListTitle', idList, newTitle)
        client.broadcast.emit('UpdateListTitle', idList, newTitle)
    }
  )
}

exports.addCard = (client, titleCard, idList, idBoard) => {
  const newCard = new models.cards({title: titleCard})
  newCard.save(
    {},
    (err, res) => {
      if(err)
        console.log("Error adding card")
      boards.findOneAndUpdate(
        {_id:idBoard, "lists._id": idList},
        { "$push": { "lists.$.cards": res._id }},
        (err, res) => {
          if (err)
            console.log("Error updating board")
          else {
            console.log("Card : " + newCard._id + " added to List : " + idList)
            client.emit('addCard', newCard, idList, idBoard);  
            client.broadcast.emit('addCard', newCard, idList, idBoard);
          }
        }
      )
    }
  )
}

exports.getAllCards = (client, idList, idBoard) => {
  boards.findOne(
    {_id: idBoard, "lists._id": idList},
    {"lists.$": 1, _id: 0},
    (err, res) => {
      if (res === null)
        client.emit('getAllCards', idList, [])
      else {
        models.cards.find(
          {_id: {$in: res.lists[0].cards}},
          (err, res) => {
            client.emit('getAllCards', res, idList);  
          }
        )
      }
    }
  )
}