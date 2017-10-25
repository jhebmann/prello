const Card = require('../../models').cards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Card.find().then(function(card){
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Card.findById(req.params.id).then(function(card){
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.post('/', function (req, res, next) {
    
})

router.put('/:id', function (req, res, next) {
    
})

router.delete('/:id', function (req, res, next) {
    
})

router.delete('/', function (req, res, next) {
    Card.remove().then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})


module.exports = router