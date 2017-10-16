'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const checklists = models.checklists

exports.findAll = function(req, res) {
    checklists.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};