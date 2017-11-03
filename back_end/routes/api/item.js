const models = require('../../models')
const Card = models.cards
const Item = models.items
const router = require('express').Router()

router.get('/:id/checklist/:idChecklist/card/:idCard', function (req, res, next) {
    // Get the item having the id given in parameter
    Card.findOne(
        {_id: req.params.idCard, "checklists._id": req.params.idChecklist, "checklists.items._id": req.params.id},
        {"checklists.items.$": 1, _id: 0},
        (err, card) => {
            if (err) res.status(401).send(err)
            else {
                const items = card.checklists[0].items
                let item = {}
                items.forEach(function(i) {
                    if (i._id.equals(req.params.id)){
                        item = i
                    }
                })
                res.status(200).send(item)
            }
        }
    )
})

router.post('/checklist/:idChecklist/card/:idCard', function (req, res, next) {
    // Post a new item
    const newItem = new Item({
        title: req.body.title,
        isDone: req.body.isDone
    })
    Card.findOneAndUpdate(
        {_id: req.params.idCard, "checklists._id": req.params.idChecklist},
        {$push: {"checklists.$.items": {items: newItem}}},
        (err) => {
            if (err) res.status(401).send(err)
            else res.status(200).send(newItem)
        }
    )
})

router.put('/:id/checklist/:idChecklist/card/:idCard', function (req, res, next) {
    // Update the item having the id given in parameter
    const id = req.params.id
    const idChecklist = req.params.idChecklist
    const idCard = req.params.idCard
    Card.findOne(
        {_id: req.params.idCard, "checklists._id": req.params.idChecklist, "checklists.items._id": req.params.id},
        (err, card) => {
            if (err) res.status(401).send(err)
            else {
                if ('undefined' !== typeof req.body.title) card.checklists.id(idChecklist).items.id(id).title = req.body.title
                if ('undefined' !== typeof req.body.isDone) card.checklists.id(idChecklist).items.id(id).isDone = req.body.isDone
                card.save(
                    (err, card) => {
                        if (err) res.status(401).send(err)
                        else res.status(200).send(card.checklists.id(idChecklist))
                    }
                )
            }
        }
    )
})

router.delete('/:id/checklist/:idChecklist/card/:idCard', function (req, res, next) {
    // Delete the item having the id given in parameter
    const id = req.params.id
    const idChecklist = req.params.idChecklist
    const idCard = req.params.idCard
    Card.findOne(
        {_id: req.params.idCard, "checklists._id": req.params.idChecklist, "checklists.items._id": req.params.id},
        (err, card) => {
            card.checklists.id(idChecklist).items.forEach((item) => {
                if (item._id.equals(id)){
                    card.checklists.id(idChecklist).items.pull(item)
                }
            })
            card.save(
                (err) => {
                    if (err) res.status(401).send(err)
                    else res.status(200).send("Successfully deleted the list of id " + id)
                }
            )
        }
    )
})

module.exports = router