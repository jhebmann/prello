'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const comments = models.comments

exports.findAll = function(req, res) {
    comments.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};