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

router.post('/', function (req, res, next) {
    // Post a new comment into a card
    Card.findById(req.body.cardId, function(err, card){
        let newcomment = new Comment()
        newcomment.content = req.body.content,
        newcomment.createdAt = req.body.createdAt,
        newcomment.postedBy = req.body.postedBy
        card.comments.push(newcomment)
        card.save()
    }).then(function(){
        res.status(200).send("Successfully created")
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id', function (req, res, next) {
    // Update the comment having the id given in parameter
    
})

router.delete('/:id', function (req, res, next) {
    // Delete the comment having the id given in parameter
    
})


module.exports = router