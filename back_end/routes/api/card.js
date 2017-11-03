const models = require('../../models')
const Card = models.cards
const Board = models.boards
const Label = models.labels
const ObjectId = require('mongoose').Types.ObjectId
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
          { "$push": { "lists.$.cards": {_id: res._id, pos: req.body.pos}}},
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
    const id = req.params.id
    Card.findOne(
        {
            _id : id,
        },
        (err, card) => {
            if (err) res.status(401).send(err)
            else{
                if ('undefined' !== typeof req.body.title) card.title = req.body.title
                if ('undefined' !== typeof req.body.description) card.description = req.body.description
                if ('undefined' !== typeof req.body.dueDate) card.dueDate = req.body.dueDate
                if ('undefined' !== typeof req.body.doneDate) card.doneDate = req.body.doneDate
                if ('undefined' !== typeof req.body.isArchived) card.isArchived = req.body.isArchived
                card.save((err, card) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The card of id " + id + " has been successfully updated")
                        res.status(200).send(card)
                    }                
                })
            }
        }
    )
})

router.put('/:id/user/:idUser', function (req, res, next) {
    // Update the card having the id given in parameter to add a user to it
    const id = req.params.id
    const idUser = req.params.idUser
    Card.findOneAndUpdate({_id : id},
        {$push: {$users: idUser}},
        {new: true}
    ).then(function(card) {
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.put('/:id/oldList/:idOldList/newList/:idNewList/board/:idBoard', function (req, res, next) {
    // move a card from one list to another
    const id = req.params.id
    const idOldList = req.params.idOldList
    const idNewList = req.params.idNewList
    const idBoard = req.params.idBoard
    const oldPos = req.body.oldPos
    const newPos = req.body.newPos
    Board.update(
        {_id: idBoard, "lists._id": idOldList},
        {$pull: {"lists.$.cards": {_id: id, pos: oldPos}}},
        (err, result) =>{
            if (err) res.status(401).send("Couldn't delete the card of id " + id + " from the list of id " + idOldList)
            else if (result.nModified === 0) res.status(401).send("There is no card of id " + id + " in the list of id " + idOldList)
            else{
                Board.findById(idBoard, function(err, data){
                    data.lists.id(idOldList).cards.forEach((card) => {
                        if (card.pos > oldPos){
                            card.pos--
                        }
                    })
                    data.save((err, result) => {
                        //Couldn't save the new positions, so trying to revert the card deletion
                        if (err){
                            Board.update(
                                {_id: idBoard, "lists._id": idOldList},
                                {$push: {"lists.$.cards": {_id: id, pos: oldPos}}},
                                (err) =>{
                                    if (err) res.status(401).send("Couldn't change the positions of the cards and couldn't revert the deletion of the card")
                                    else res.status(401).send("Couldn't change the positions of the cards but could revert the deletion of the card")
                                }
                            )
                        }
                        //First list saved, now is time to update the other list
                        else{
                            Board.findOneAndUpdate(
                                {_id: idBoard, "lists._id": idNewList},
                                {$push: {"lists.$.cards": {_id: id, pos: newPos}}},
                                {new: true},
                                (err, result) =>{
                                    if (err) res.status(401).send("Couldn't create the card of id " + id + " on the list of id " + idNewList)
                                    else {
                                        Board.findById(idBoard, function(err, data){
                                            data.lists.id(idNewList).cards.forEach((card) => {
                                                if (card.pos >= newPos && !card._id.equals(id)){
                                                    card.pos++
                                                }
                                            })
                                            data.save().then(() => {
                                                //Couldn't save the new positions, so trying to revert the card addition
                                                if (err){
                                                    Board.findOneAndUpdate(
                                                        {_id: idBoard, "lists._id": idNewList},
                                                        {$pull: {"lists.$.cards": {_id: id, pos: newPos}}},
                                                        (err) =>{
                                                            if (err) res.status(401).send("Couldn't change the positions of the cards and couldn't revert the addition of the card")
                                                            else res.status(401).send("Couldn't change the positions of the cards but could revert the addition of the card")
                                                        }
                                                    )
                                                }
                                                else {
                                                    res.status(200).send(data)
                                                }
                                            })
                                        })
                                    }
                                }
                            )
                        }
                    })
                })
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