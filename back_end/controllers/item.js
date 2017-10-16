'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const items = models.items

exports.findAll = function(req, res) {
    items.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};