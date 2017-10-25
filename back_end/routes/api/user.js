const User = require('../../models').users
const router = require('express').Router()
const mongoose = require('mongoose')

// Done

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
    }).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.delete('/:id', function (req, res, next) {
    User.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/', function (req, res, next) {
    User.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})


router.put('/:id', function (req, res, next) {
    User.findOneAndUpdate({_id : req.params.id},
        {
            "local.nickname": ('undefined' !== typeof req.body.local.nickname) ? req.body.local.nickname : null ,
            "local.password" : ('undefined' !== typeof req.body.local.password) ? req.body.local.password : null
        }
    ).then(function() {
        res.status(200).send("Successfully updated")
    }).catch(function(err) {
        res.send(err)
    })
})


module.exports = router