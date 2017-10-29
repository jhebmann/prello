const User = require('../../models').users
const router = require('express').Router()
const mongoose = require('mongoose')

// Done

router.get('/', function (req, res, next) {
    // Return all the users
    User.find().then(function(user){
        res.status(200).send(user)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    // Return the user having the id given in parameter
    User.findById(req.params.id).then(function(user){
        res.status(200).send(user)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:userId/teams', function (req, res, next) {
    // Get all teams of the user having the id given in parameter
})

router.post('/', function (req, res, next) {
    // Post a new user
    User.create({ _id: mongoose.Types.ObjectId(),
        local : {
            nickname : req.body.local.nickname,
            password : req.body.local.password,
            mail : req.body.local.mail,
            firstname : req.body.local.firstname,
            lastnamme : req.body.local.lastnamme
        },
        ldap : {
            nickname : req.body.ldap.nickname,
            password : req.body.ldap.password
        }        
    }).then(function(user) {
        res.status(200).send(user);
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.delete('/:id', function (req, res, next) {
    // Delete the user having the id given in parameter
    User.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/', function (req, res, next) {
    // Delete all the users
    User.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})


router.put('/:id', function (req, res, next) {
    // Update the user having the id given in parameter (not completed)
    User.findOneAndUpdate({_id : req.params.id},
        {
            "local.nickname": ('undefined' !== typeof req.body.local.nickname) ? req.body.local.nickname : null ,
            "local.password" : ('undefined' !== typeof req.body.local.password) ? req.body.local.password : null
        }
    ).then(function(user) {
        res.status(200).send(user)
    }).catch(function(err) {
        res.send(err)
    })
})


module.exports = router