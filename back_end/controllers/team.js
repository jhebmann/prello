'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')
const teams = models.teams

exports.findAll = function(req, res) {
    teams.find({}, function(err, card) {
    if (err)
      res.send(err);
    res.json(card);
  });
};