const Team = require('../../models').teams
const router = require('express').Router()

// Done

router.get('/', function (req, res, next) {
    // Get all the teams
    Team.find().then(function(team){
        res.status(200).send(team)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    // Get the team having the id given in parameter
    Team.findById(req.params.id).then(function(team){
        res.status(200).send(team)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:teamId/boards', function (req, res, next) {
    // Get all boards of the team having the id given in parameter
})

router.get('/:teamId/users', function (req, res, next) {
    // Get all members of the team having the id given in parameter
})

router.get('/:teamId/admins', function (req, res, next) {
    // Get all admins of the team having the id given in parameter
})

router.post('/', function (req, res, next) {
    // Post a new team
    Team.create({ 
        name: req.body.name,
        description: req.body.description,
        users: ('undefined' !== typeof req.body.users) ? req.body.users : [],
        admins: req.body.admins
    }).then(function(team) {
        res.status(200).send(team)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.delete('/:id', function (req, res, next) {
    // Delete the team having the id given in parameter
    Team.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    });
})

router.delete('/', function (req, res, next) {
    // Delete all the users
    Team.remove().then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})


router.put('/:id', function (req, res, next) {
    // Update the team with the id given in parameter
    Team.findOneAndUpdate({_id : req.params.id},
        {
            "name": ('undefined' !== typeof req.body.name) ? req.body.name : null ,
            "description" : ('undefined' !== typeof req.body.description) ? req.body.description : null
        }
    ).then(function(team) {
        res.status(200).send(team)
    }).catch(function(err) {
        res.send(err)
    })
})


module.exports = router