const models = require('../../models')
const Card = models.cards
const Board = models.boards
const Label = models.labels
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

router.get('/:id/labels', function (req, res, next) {
    // Get all labels of the card having the id given in parameter
    Card.findOne(
        {_id: req.params.id},
        (err, card) => {
            if (err) res.status(401).send("There was an error retrieving the card of id " + req.params.id)
            else {
                Label.find(
                    {_id: {$in: card.labels}},
                    (err, labels) => {
                        if (err) res.status(401).send("There was an error retrieving the labels of the card of id " + req.params.id)
                        else res.status(200).send(labels)
                    }
                )
            }
        }
    )
})

router.post('/board/:boardId/list/:listId', function (req, res, next) {
    // Post a new card
    const newCard = new Card({
        title: req.body.title
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
    Card.findOneAndUpdate({_id : req.params.id},
        {
            "title": ('undefined' !== typeof req.body.title) ? req.body.title : undefined,
            "description" : ('undefined' !== typeof req.body.description) ? req.body.description : undefined,
            "dueDate" : ('undefined' !== typeof req.body.dueDate) ? req.body.dueDate : undefined,
            "doneDate" : ('undefined' !== typeof req.body.doneDate) ? req.body.doneDate : undefined,
            "createdAt" : ('undefined' !== typeof req.body.createdAt) ? req.body.createdAt : undefined,
            "isArchived" : ('undefined' !== typeof req.body.isArchived) ? req.body.isArchived : undefined,
            "checklists" : ('undefined' !== typeof req.body.checklists) ? req.body.checklists : undefined,
            "attachments" : ('undefined' !== typeof req.body.attachments) ? req.body.attachments : undefined,
            "comments" : ('undefined' !== typeof req.body.comments) ? req.body.comments : undefined,
            "labels" : ('undefined' !== typeof req.body.labels) ? req.body.labels : undefined
        },
        {new: true}
    ).then(function(card) {
        res.status(200).send(card)
    }).catch(function(err) {
        res.send(err)
    })
})

router.put('/:id/oldList/:idOldList/newList/:idNewList/board/:idBoard', function (req, res, next) {
    // Update the card having the id given in parameter
    const id = req.params.id
    const idOldList = req.params.idOldList
    const idNewList = req.params.idNewList
    const idBoard = req.params.idBoard
    Board.update(
        {_id: idBoard, "lists._id": idOldList},
        {$pull: {"lists.$.cards": id}},
        (err, result) =>{
            if (err) res.status(401).send("Couldn't delete the card of id " + id + " from the list of id " + idOldList)
            else if (result.nModified === 0) res.status(401).send("There is no card of id " + id + " in the list of id " + idOldList)
            else{
                Board.update(
                    {_id: idBoard, "lists._id": idNewList},
                    {$push: {"lists.$.cards": id}},
                    {new: true},
                    (err, board) => {
                        if (err) res.status(401).send("Couldn't add the card of id " + id + " to the list of id " + idNewList)
                        else res.status(200).send(board)
                    }
                )
            }            
        }
    )
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
    const idList = req.params.idList
    const idBoard = req.params.idBoard
    Board.findOne(
        {_id: idBoard, "lists._id": idList},
        {"lists.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send("Couldn't find list of id " + idList)
            else {
                const cardsIds = board.lists[0].cards
                Board.findOneAndUpdate(
                    {_id: idBoard, "lists._id": idList},
                    {$set: {"lists.$.cards": []}},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else {
                            Card.remove(
                                {_id: {$in: cardsIds}}
                            ).then(function() {
                                res.status(200).send("Successfully destroyed all cards from list " + idList + " in board " + idBoard)
                            }).catch(function(err) {
                                res.status(401).send(err)
                            })
                        }
                    }
                )
            }
        }
    )
})

/**
 * Delete all the cards
 */
router.delete('/', function (req, res, next) {
    Board.find({}).cursor()
        .on("data", function(board){
            board.lists.forEach(function(list){
                console.log(list)
                list.cards = []
            })
            board.save()
        })
        .on("error", function(err){
            res.status(401).send(err)
        }).on('end', function(){
            Card.remove().then(function() {
                res.status(200).send("Successfully destroyed all the cards")
            }).catch(function(err) {
                res.status(401).send(err)
            })
        });
})

module.exports = router