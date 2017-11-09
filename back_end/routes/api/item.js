const models = require('../../models')
const Card = models.cards
const Item = models.items
const router = require('express').Router()

router.get('/:id/checklist/:checklistId/card/:cardId', function (req, res, next) {
    // Get the item having the id given in parameter
    const id = req.params.id
    const checklistId = req.params.checklistId
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "checklists._id": checklistId, "checklists.items._id": id},
        {"checklists.items.$": 1, _id: 0},
        (err, card) => {
            if (err) res.status(401).send(err)
            else if (card === null) res.status(401).send("Couldn't find the card of id " + cardId + ", the checklist of id " + checklistId + " or the item of id " + id)
            else res.status(200).send(card.checklists[0].items.id(id))
        }
    )
})

router.post('/checklist/:checklistId/card/:cardId', function (req, res, next) {
    // Post a new item
    const id = req.params.id
    const checklistId = req.params.checklistId
    const cardId = req.params.cardId
    
    const newItem = new Item()
    newItem.title = ('undefined' !== typeof req.body.title) ? req.body.title : "",
    newItem.isDone = ('undefined' !== typeof req.body.isDone) ? req.body.isDone : false

    Card.findOneAndUpdate(
        {_id: req.params.cardId, "checklists._id": req.params.checklistId},
        {$push: {"checklists.$.items": newItem}},
        (err) => {
            if (err) res.status(401).send(err)
            else res.status(200).send(newItem)
        }
    )
})

router.put('/:id/checklist/:checklistId/card/:cardId', function (req, res, next) {
    // Update the item having the id given in parameter
    const id = req.params.id
    const checklistId = req.params.checklistId
    const cardId = req.params.cardId

    Card.findOne(
        {_id: req.params.cardId, "checklists._id": req.params.checklistId, "checklists.items._id": req.params.id},
        (err, card) => {
            if (err) res.status(401).send(err)
            else if (card === null) res.status(401).send("Couldn't find the card of id " + cardId + ", the checklist of id " + checklistId + " or the item of id " + id)            
            else {
                if ('undefined' !== typeof req.body.title) card.checklists.id(checklistId).items.id(id).title = req.body.title
                if ('undefined' !== typeof req.body.isDone) card.checklists.id(checklistId).items.id(id).isDone = req.body.isDone
                card.save(
                    (err, card) => {
                        if (err) res.status(401).send(err)
                        else{
                            console.log("The item of id " + id + "has been successfully updated")
                            res.status(200).send(card.checklists.id(checklistId).items.id(id))
                        }
                    }
                )
            }
        }
    )
})

router.delete('/:id/checklist/:checklistId/card/:cardId', function (req, res, next) {
    // Delete the item having the id given in parameter
    const id = req.params.id
    const checklistId = req.params.checklistId
    const cardId = req.params.cardId
    
    Card.findOne(
        {_id: req.params.cardId, "checklists._id": req.params.checklistId, "checklists.items._id": req.params.id},
        (err, card) => {
            if (err) res.status(401).send(err)
            else if (card === null) res.status(401).send("Couldn't find the card of id " + cardId + ", the checklist of id " + checklistId + " or the item of id " + id)            
            else {
                card.checklists.id(checklistId).items.pull(card.checklists.id(checklistId).items.id(id))
                card.save()
                .then(function(card){
                    res.status(200).send("Successfully destroyed")
                }).catch(function(err){
                    res.status(401).send("Couldn't delete the list of id " + id)
                })
            }
        }
    )
})

module.exports = router