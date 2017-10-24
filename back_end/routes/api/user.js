const User = require('../../models').users
const router = require('express').Router()
const mongoose = require('mongoose')

router.get('/', function (req, res, next) {
    User.find().then(function(user){
        res.status(200).send(user)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    User.findById(req.params.id).then(function(user){
        res.status(200).send(user)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.post('/', function (req, res, next) {
    User.create({ _id: mongoose.Types.ObjectId(),
        local:{
            nickname: req.body.local.nickname,
            password: req.body.local.password,
            mail: req.body.local.mail
    }}).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id', function (req, res, next) {
    User.findByIdAndUpdate(req.params.id, {$set: {}}).then(function() {//define what to add
        res.status(200).send("Successfully updated");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/:id', function (req, res, next) {
    User.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/all', function (req, res, next) {
    User.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})


module.exports = router