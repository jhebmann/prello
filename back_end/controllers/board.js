'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const boards = models.boards

exports.findAll = function(req, res) {
    boards.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};