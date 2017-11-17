const models = require('../../models')
const Card = models.cards
const Comment = models.comments
const User = models.users
const router = require('express').Router()

router.get('/:id/card/:cardId', function (req, res, next) {
    // Get the comment having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "comments._id": req.params.id},
        {"comments.$": 1, _id: 0}
    ).then(function(card){
        res.status(200).send(card.comments[0])
    }).catch(function(err) {
        res.status(404).send(err)
    })
})

router.get('/:id/card/:cardId/user', function (req, res, next) {
    // Get user that posted the comment
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "comments._id": id},
        {"comments.$": 1},
        (err, card) => {
            if (err) res.status(404).send(err)
            else if (card === null) res.status(404).send("Couldn't find the card of id " + cardId + " or the comment of id " + id)            
            else {
                User.findOne(
                    {_id: card.comments[0].postedBy},
                    (err, user) => {
                        if (err) res.status(404).send(err)
                        else if (user === null) res.status(404).send("Couldn't find the user of id " + card.comments[0].postedBy)            
                        else res.status(200).send(user)
                    }
                )
            }
        }
    )
})

router.post('/card/:cardId', function (req, res, next) {
    // Post a new comment into a card
    const cardId = req.params.cardId

    Card.findById(cardId, function(err, card){
        let newcomment = new Comment()
        newcomment.content = ('undefined' !== typeof req.body.content) ? req.body.content : "",
        newcomment.createdAt = Date.now(),
        newcomment.lastModifiedAt = Date.now(),
        newcomment.postedBy = req.body.postedBy
        card.comments.push(newcomment)
        card.save()
        .then(function(card){
            res.status(200).send(card.comments[card.comments.length - 1])
        }).catch(function(err) {
            res.status(409).send(err)
        })
    })
})

router.put('/:id/card/:cardId', function (req, res, next) {
    // Update the comment having the id given in parameter and that is contained in the card having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {
            _id : cardId,
            comments: {$elemMatch: {_id: id}}
        },
        (err, card) => {
            if (err) res.status(404).send(err)
            else if (card === null) res.status(404).send("Couldn't find the card of id " + cardId + " or the comment of id " + id)   
            else{
                if ('undefined' !== typeof req.body.content){
                    card.comments.id(id).content = req.body.content
                    card.comments.id(id).lastModifiedAt = Date.now()
                }
                card.save((err) => {
                    if (err) res.status(409).send(err)
                    else {
                        console.log("The comment of id " + id + " has been successfully updated")
                        res.status(200).send(card.comments.id(id))
                    }                
                })
            }
        }
    )
})

router.delete('/:id/card/:cardId', function (req, res, next) {
    // Delete the comment having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "comments._id": id},
        (err, card) => {
            if (err) res.status(404).send(err)
            else if (card === undefined || card === null) res.status(404).send("There is no card of id " + cardId + " or comment of id " + id)
            else {
                card.comments.pull(card.comments.id(id))
                card.save()
                .then(function(card){
                    res.status(200).send("Successfully destroyed")
                }).catch(function(err){
                    res.status(409).send("Couldn't delete the comment of id " + id)
                })
            }
        }
    )
})


module.exports = router