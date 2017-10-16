'use strict';

const mongoose = require('mongoose')
const models = require('../models/index')
const lists = models.lists

exports.listAllCards = function(req, res) {
  lists.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};

exports.createACard = function(req, res) {
  console.log(req.body);  
  const newList = new lists(req.body);
  newList.save(function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};

exports.deleteCollection = function(req, res) {
  lists.remove({}, function(err, card) {
    if (err){
      console.log('problems')
      res.send(err);
    }
    res.json({ message: 'Collection successfully deleted' });
  });
};
