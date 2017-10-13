'use strict';

const mongoose = require('mongoose')
const models = require('../models/index')
const lists = models.Lists
//Card = mongoose.model('Lists');

exports.list_all_cards = function(req, res) {
  lists.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};

exports.create_a_card = function(req, res) {
  console.log(req.body);  
  const new_card = new lists(req.body);
  new_card.save(function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};

exports.delete_collection = function(req, res) {
  lists.remove({}, function(err, card) {
    if (err){
      console.log('problems')
      res.send(err);
    }
    res.json({ message: 'Collection successfully deleted' });
  });
};