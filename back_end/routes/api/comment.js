const Card = require('../../models').cards
const Comment = require('../../models').comments
const User = require('../../models').users
const router = require('express').Router()

router.get('/:id', function (req, res, next) {
    // Get the comment having the id given in parameter
    Card.findOne({'comments._id': req.params.id}, '-_id').select({ comments: {$elemMatch: {_id: req.params.id}}})
    .then(function(cardsMatching){
        res.status(200).send(cardsMatching.comments[0])
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:commentId/card/:cardId/users', function (req, res, next) {
    // Get user that posted the comment
    Card.findOne({_id: req.params.cardId, "comments._id": req.params.commentId}, 'comment',
        (err, card) => {
            if (card === null)
                res.status(401).send(err)
            else {
            User.find(
                {_id: {$in: card.comments[0].postedBy}},
                (err, user) => {
                    res.status(200).send(user)
                }
            )}
        }
    )
})

router.post('/card/idCard', function (req, res, next) {
    // Post a new comment into a card
    Card.findById(req.params.idCard, function(err, card){
        let newcomment = new Comment()
        newcomment.content = req.body.content,
        newcomment.createdAt = req.body.createdAt,
        newcomment.postedBy = req.body.postedBy
        card.comments.push(newcomment)
        card.save()
        .then(function(card){
            res.status(200).send(card.comments[card.comments.length - 1])
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
            comments: {$elemMatch: {_id: id}}
        },
        {
            "comments.$.content" : ('undefined' !== typeof req.body.content) ? req.body.content : undefined,
            "comments.$.lastModifiedAt" : ('undefined' !== typeof req.body.content) ? Date.now() : undefined
        }
    ).then(function() {
        res.status(200).send("The comment of id " + id + " has been successfully updated")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.delete('/:id/card/:idCard', function (req, res, next) {
    // Delete the comment having the id given in parameter
    Card.findOne(
        {_id: req.params.idCard, "comments._id": req.params.id},
        {"comments.$": 1, _id: 0},
        (err, card) => {
            if (err) res.status(401).send("There was an error retrieving the card of id " + req.params.idCard + " or comment of id " + req.params.id)
            else if (card === undefined || card === null) res.status(401).send("There is no card of id " + req.params.idCard + " or comment of id " + req.params.id)
            else {
                const comment = card.comments[0]
                Card.findOneAndUpdate(
                    {_id: req.params.idCard},
                    {$pull: {comments: comment}},
                    (err, card) => {
                        if (err) res.status(401).send("Couldn't delete the comment of id " + comment._id)
                        else res.status(200).send("Successfully destroyed")
                    }
                )
            }
        }
    )
})


module.exports = router