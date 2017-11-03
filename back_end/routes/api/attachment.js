const Attachment = require('../../models').attachments
const Card = require('../../models').cards
const Comment = require('../../models').comments
const User = require('../../models').users
const router = require('express').Router()

router.get('/:id', function (req, res, next) {
    // Return the attachment having the id given in parameter
    Card.findOne({'attachments._id': req.params.id}, '-_id').select({ attachments: {$elemMatch: {_id: req.params.id}}})
    .then(function(cards){
        res.status(200).send(cards.attachments[0])
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:attachmentId/card/:cardId/users', function (req, res, next) {
    // Get user that posted the attachment
    Card.findOne({_id: req.params.cardId, "attachments._id": req.params.attachmentId}, 'attachment',
        (err, card) => {
            if (card === null)
                res.status(401).send(err)
            else {
            User.find(
                {_id: {$in: card.attachments[0].postedBy}},
                (err, user) => {
                    res.status(200).send(user)
                }
            )}
        }
    )
})

router.get('/:attachmentId/card/:cardId/comments', function (req, res, next) {
    // Get comment linked to the attachment
    Card.findOne({_id: req.params.cardId, "attachments._id": req.params.attachmentId}, 'attachment',
        (err, card) => {
            if (card === null)
                res.status(401).send(err)
            else {
            Comment.find(
                {_id: {$in: card.attachments[0].linkedComment}},
                (err, comment) => {
                    res.status(200).send(comment)
                }
            )}
        }
    )
})

router.post('/card/:idCard', function (req, res, next) {
    // Post a new attachment into a card
    Card.findById(req.params.idCard, function(err, card){
        let newattachment = new Attachment()
        newattachment.title = req.body.title,
        newattachment.file = req.body.file,
        newattachment.postedBy = req.body.postedBy,
        newattachment.linkedComment = req.body.linkedComment
        card.attachments.push(newattachment)
        card.save()
        .then(function(card){
            res.status(200).send(card.attachments[card.attachments.length - 1])
        }).catch(function(err) {
            res.status(401).send(err);
        })
    })
})

router.put('/:id/card/:idCard', function (req, res, next) {
    // Update the attachment having the id given in parameter
    const id = req.params.id
    const idCard = req.params.idCard
    Card.findOne(
        {
            _id : idCard,
            attachments: {$elemMatch: {_id: id}}
        },
        (err, card) => {
            if (err) res.status(401).send(err)
            else{
                if ('undefined' !== typeof req.body.title) card.attachments.id(id).title = req.body.title
                card.save((err, card) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The attachment of id " + id + " has been successfully updated")
                        res.status(200).send(card.attachments.id(id))
                    }                
                })
            }
        }
    )
})

router.delete('/:id', function (req, res, next) {
    // Delete the attachment having the id given in parameter
})



module.exports = router