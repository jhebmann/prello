const Team = require('../../models').teams
const router = require('express').Router()

// Done

router.get('/', function (req, res, next) {
    Team.find().then(function(team){
        res.status(200).send(team)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    Team.findById(req.params.id).then(function(team){
        res.status(200).send(team)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.post('/', function (req, res, next) {
    Team.create({ 
        name: req.body.name,
        description: req.body.description,
        users: ('undefined' !== typeof req.body.users) ? req.body.users : [],
        admins: req.body.admins
    }).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.delete('/:id', function (req, res, next) {
    Team.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    });
})

router.delete('/', function (req, res, next) {
    Team.remove().then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})


router.put('/:id', function (req, res, next) {
    Team.findOneAndUpdate({_id : req.params.id},
        {
            "name": ('undefined' !== typeof req.body.name) ? req.body.name : null ,
            "description" : ('undefined' !== typeof req.body.description) ? req.body.description : null
        }
    ).then(function() {
        res.status(200).send("Successfully updated")
    }).catch(function(err) {
        res.send(err)
    })
})


module.exports = router