const Card = require('../../models').cards
const Board = require('../../models').boards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    // Get all the cards
    Card.find().then(function(card){
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    // Get the card having the id given in parameter
    Card.findById(req.params.id).then(function(card){
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:cardId/labels', function (req, res, next) {
    // Get all labels of the card having the id given in parameter
})

router.post('/board/:boardId/list/:listId', function (req, res, next) {
    // Post a new card
    const newCard = new Card({
        titleCard: req.params.titleCard,
        description: req.params.description
    })
    newCard.save(
      {},
      (err, res) => {
        if(err)
          console.log("Error adding card")
        Board.findOneAndUpdate(
          {_id : req.params.boardId, "lists._id" : req.params.listId},
          { "$push": { "lists.$.cards": res._id }},
          (err, res) => {
            if (err)
              console.log("Error when adding the card in board")
            else {
              console.log("Card : " + newCard._id + " added to List : " + req.params.listId)
            }
          }
        )
      }
    )
})

router.put('/:id', function (req, res, next) {
    // Update the card having the id given in parameter
    
})

router.delete('/:id', function (req, res, next) {
    // Delete the card having the id given in parameter
    
})

router.delete('/', function (req, res, next) {
    // Delete all cards
    Card.remove().then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})


module.exports = router