'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const labels = models.labels

exports.findAll = function(req, res) {
    labels.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};