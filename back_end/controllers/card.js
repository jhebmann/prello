'use strict';

const mongoose = require('mongoose')
const models = require('../models/index')
const lists = models.Lists
//Card = mongoose.model('Lists');

exports.findAll = function(req, res) {
  lists.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};

exports.add = function(req, res) {
  console.log(req.body);  
  const newCard = new lists(req.body);
  newCard.save(function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};

exports.deleteAll = function(req, res) {
  lists.remove({}, function(err, card) {
    if (err){
      console.log('problems')
      res.send(err);
    }
    res.json({ message: 'Collection successfully deleted' });
  });
};
