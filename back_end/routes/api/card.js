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
        res.status(401).send(err)
    })
})

router.get('/:cardId/labels', function (req, res, next) {
    // Get all labels of the card having the id given in parameter
})

router.post('/board/:boardId/list/:listId', function (req, res, next) {
    // Post a new card
    const newCard = new Card({
        titleCard: req.body.titleCard
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
            if (err){
                console.log("Error when adding the card in board")
            }              
            else {
              console.log("Card : " + newCard._id + " added to List : " + req.params.listId)
            }
          }
        )
      }
    ).then(function(newCard) {
        res.status(200).send(newCard)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.put('/:id', function (req, res, next) {
    // Update the card having the id given in parameter
    
})

/**
 * Delete the card with the specified id
 */
router.delete('/:id/list/:idList/board/:idBoard', function (req, res, next) {
    const id = req.params.id
    Board.findOneAndUpdate(
        {_id: req.params.idBoard, "lists._id": req.params.idList},
        {"$pull": {"lists.$.cards": id}},
        (err) => {
            if (err)
                throw err
            Card.findOneAndRemove(
                {_id: id}
            ).then(function() {
                res.status(200).send("The card of id " + id + " was successfully destroyed")
            }).catch(function(err) {
                res.status(401).send(err)
            })
        }
    )
})

/**
 * Delete all cards from a list
 */
router.delete('/list/:idList/board/:idBoard', function (req, res, next) {
    Board.findOne(
        {_id: req.params.idBoard, "lists._id": req.params.idList},
        {"lists.$": 1, _id: 0},
        (err, board) => {
            const cardsIds = board.lists[0].cards
            Board.findOneAndUpdate(
                {_id: req.params.idBoard, "lists._id": req.params.idList},
                {$set: {"lists.$.cards": []}},
                (err) => {
                    if (err) throw err
                    Card.remove(
                        {_id: {$in: cardsIds}}
                    ).then(function() {
                        res.status(200).send("Successfully destroyed")
                    }).catch(function(err) {
                        res.status(401).send(err)
                    })
                }
            )
        }
    )
})

/**
 * Delete all the cards
 */
router.delete('/', function (req, res, next) {
    Board.update(
        {"lists.null": null},
        {$set: {"lists.$.cards": []}},
        (err) => {
            if (err) throw err
            Card.remove().then(function() {
                res.status(200).send("Successfully destroyed")
            }).catch(function(err) {
                res.status(401).send(err)
            })
        }
    )
})

module.exports = router