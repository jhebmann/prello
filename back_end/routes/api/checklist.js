const models = require('../../models')
const Checklist = models.checklists
const Card = models.cards
const Item = models.items
const router = require('express').Router()

router.get('/:id/card/:cardId', function (req, res, next) {
    // Get the checklist having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "checklists._id": id},
        {"checklists.$": 1, _id: 0}
    ).then(function(card){
        res.status(200).send(card.checklists[0])
    }).catch(function(err) {
        res.status(404).send(err)
    })
})

router.get('/:id/card/:cardId/items', function (req, res, next) {
    // Get the items of the checklist having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "checklists._id": id},
        {"checklists.$": 1, _id: 0}
    ).then(function(card){
        res.status(200).send(card.checklists[0].items)
    }).catch(function(err) {
        res.status(404).send(err)
    })
})

router.post('/card/:cardId', function (req, res, next) {
    // Post a new checklist
    const cardId = req.params.cardId
    
    Card.findById(cardId, function(err, card){
        if (err) res.status(404).send(err)
        else{
            let newChecklist = new Checklist()
            newChecklist.title = ('undefined' !== typeof req.body.title) ? req.body.title : ""
            card.checklists.push(newChecklist)
            card.save()
            .then(function(card){
                res.status(200).send(card.checklists[card.checklists.length - 1])
            }).catch(function(err) {
                res.status(409).send(err)
            })
        }
    })
})

router.put('/:id/card/:cardId', function (req, res, next) {
    // Update the checklist having the id given in parameter and that is contained in the card having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {
            _id : cardId,
            checklists: {$elemMatch: {_id: id}}
        },
        (err, card) => {
            if (err) res.status(404).send(err)
            else if (card === null) res.status(404).send("Couldn't find the card of id " + cardId + " or the checklist of id " + id)   
            else{
                if ('undefined' !== typeof req.body.title) card.checklists.id(id).title = req.body.title
                card.save((err) => {
                    if (err) res.status(409).send(err)
                    else {
                        console.log("The checklist of id " + id + " has been successfully updated")
                        res.status(200).send(card.checklists.id(id))
                    }                
                })
            }
        }
    )
})

router.delete('/:id/card/:cardId', function (req, res, next) {
    // Delete the checklist having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "checklists._id": id},
        (err, card) => {
            if (err) res.status(404).send(err)
            else if (card === undefined || card === null) res.status(404).send("There is no card of id " + cardId + " or checklist of id " + id)
            else {
                card.checklists.pull(card.checklists.id(id))
                card.save()
                .then(function(card){
                    res.status(200).send("Successfully destroyed")
                }).catch(function(err){
                    res.status(409).send("Couldn't delete the checklist of id " + id)
                })
            }
        }
    )
})



module.exports = router