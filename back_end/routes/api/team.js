const Team = require('../../models').teams
const router = require('express').Router()

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
        name: req.params.name,
        admins: [req.params.admins]
    }).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id', function (req, res, next) {

})

router.delete('/:id', function (req, res, next) {
    Team.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/all', function (req, res, next) {
    Team.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})


module.exports = router