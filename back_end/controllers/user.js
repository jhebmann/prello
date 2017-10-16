'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const users = models.users

exports.findAll = function(req, res) {
    users.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};