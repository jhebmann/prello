const models = require('../../models')
const Checklist = models.checklists
const Card = models.cards
const Label = models.labels
const router = require('express').Router()

router.get('/:id/card/:idCard', function (req, res, next) {
    // Get the checklist having the id given in parameter
    Card.findOne(
        {_id: req.params.idCard, "checklists._id": req.params.id},
        {"checklists.$": 1, _id: 0}
    ).then(function(card){
        res.status(200).send(card.checklists[0])
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.post('/card/:idCard', function (req, res, next) {
    // Post a new checklist
    Card.findById(req.params.idCard, function(err, card){
        let newChecklist = new Label()
        newChecklist.title = req.body.title
        card.checklists.push(newChecklist)
        card.save()
        .then(function(card){
            res.status(200).send(card.checklists[card.checklists.length - 1])
        }).catch(function(err) {
            res.status(401).send(err);
        })
    })
})

router.put('/:id/card/:cardId', function (req, res, next) {
    // Update the label having the id given in parameter and that is contained in the card having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId
    Card.findOneAndUpdate(
        {
            _id : cardId,
            checklists: {$elemMatch: {_id: id}}
        },
        {
            "labels.$.title" : ('undefined' !== typeof req.body.title) ? req.body.title : undefined
        }
    ).then(function() {
        res.status(200).send("The checklist of id " + id + " has been successfully updated")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.delete('/:id/card/:idCard', function (req, res, next) {
    // Delete the checklist having the id given in parameter
    Card.findOne(
        {_id: req.params.idCard, "checklists._id": req.params.id},
        {"checklists.$": 1, _id: 0},
        (err, card) => {
            if (err) res.status(401).send("There was an error retrieving the card of id " + req.params.idCard + " or checklist of id " + req.params.id)
            else if (card === undefined || card === null) res.status(401).send("There is no card of id " + req.params.idCard + " or checklist of id " + req.params.id)
            else {
                const checklist = card.checklists[0]
                Card.findOneAndUpdate(
                    {_id: req.params.idCard},
                    {$pull: {checklists: checklist}},
                    (err, card) => {
                        if (err) res.status(401).send("Couldn't delete the checklist of id " + checklist._id)
                        else res.status(200).send("Successfully destroyed")
                    }
                )
            }
        }
    )
})



module.exports = router