const Checklist = require('../../models').checklists
const Card = require('../../models').cards
const router = require('express').Router()

router.get('/:id', function (req, res, next) {
    // Get the checklist having the id given in parameter
    Checklist.findById(req.params.id).then(function(checklist){
        res.status(200).send(checklist)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.post('/', function (req, res, next) {
    // Post a new checklist
    // Post a new list
    Card.findById(req.body.cardId, function(err, card){
        let checklist = new Checklist()
        checklist.title = req.body.title
        card.checklists.push(checklist)
        card.save()
        .then(function(card){
            res.status(200).send(card.checklists[card.checklists.length - 1])
        }).catch(function(err) {
            res.status(401).send(err)
        })
    })  
})

router.put('/:id', function (req, res, next) {
    // Update the checklist having the id given in parameter
    
})

router.delete('/:id', function (req, res, next) {
    // Delete the checklist having the id given in parameter
    
})



module.exports = router