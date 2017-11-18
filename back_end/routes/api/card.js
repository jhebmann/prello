const models = require('../../models')
const Card = models.cards
const Board = models.boards
const Label = models.labels
const Attachment = models.attachments
const ObjectId = require('mongoose').Types.ObjectId
const router = require('express').Router()

router.get('/', function (req, res, next) {
    // Get all the cards
    Card.find().then(function(cards){
        res.status(200).send(cards)
    }).catch(function(err) {
        res.status(404).send(err)
    })
})

router.get('/:id', function (req, res, next) {
    // Get the card having the id given in parameter
    Card.findById(req.params.id).then(function(card){
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(404).send(err)
    })
})

router.get('/:id/labels', function (req, res, next) {
    // Get all labels of the card having the id given in parameter
    const id = req.params.id

    Card.findOne(
        {_id: req.params.id},
        (err, card) => {
            if (err) res.status(404).send(err)
            else if (card === null) res.status(404).send("Couldn't find the card of id " + req.params.id)
            else {
                Board.findOne(
                    {"lists.cards._id": id},
                    (err, board) => {
                        if (err) res.status(404).send(err)
                        else if (board === null) res.status(404).send("Couldn't find the board containing the card of id " + req.params.id)
                        else {
                            let allLabels = []
                            board.labels.forEach(function(label){
                                if (card.labels.indexOf(label._id) !== -1){
                                    allLabels.push(label)
                                }
                            })
                            res.status(200).send(allLabels)
                        }
                    }
                )
            }
        }
    )
})

router.post('/board/:boardId/list/:listId', function (req, res, next) {
    // Post a new card
    const boardId = req.params.boardId
    const listId = req.params.listId
    let maxPos = -1

    Board.findOne(
        {_id: boardId, "lists._id": listId},
        (err, board) => {
            if (err) res.status(404).send(err)
            else if (board === null) res.status(404).send("Couldn't find the board of id " + boardId + " or the list of id " + listId)
            else{
                board.lists.id(listId).cards.forEach((card) => {
                    if (card.pos > maxPos)
                        maxPos = card.pos
                })
            }
        }
    ).then(function(board){
        const newCard = new Card()
        newCard.title = ('undefined' !== typeof req.body.title) ? req.body.title : ""

        newCard.save()
        .then(function(){
            const newCardRef = {
                _id: newCard._id,
                pos: maxPos + 1
            }
            board.lists.id(listId).cards.push(newCardRef)
            board.save()
            .then(function(board){
                res.status(200).send(newCard)
            }).catch(function(err) {
                res.status(409).send(err)
            })
        }).catch(function(err) {
            res.status(409).send(err)
        })
    }).catch(function(err){
        res.status(404).send(err)
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
            if (err) res.status(404).send(err)
            else if (card === null) res.status(404).send("Couldn't find the card of id " + id)
            else{
                if ('undefined' !== typeof req.body.title) card.title = req.body.title
                if ('undefined' !== typeof req.body.description) card.description = req.body.description
                if ('undefined' !== typeof req.body.dueDate) card.dueDate = req.body.dueDate
                if ('undefined' !== typeof req.body.doneDate) card.doneDate = req.body.doneDate
                if ('undefined' !== typeof req.body.isArchived) card.isArchived = req.body.isArchived
                if ('undefined' !== typeof req.body.user){
                        if(req.body.remove) card.users.pull(req.body.user)
                        else card.users.addToSet(req.body.user)
                    }
                card.save((err, card) => {
                    if (err) res.status(409).send(err)
                    else {
                        console.log("The card of id " + id + " has been successfully updated")
                        res.status(200).send(card)
                    }
                })
            }
        }
    )
})

router.put('/:id/label/add/:labelId', function (req, res, next) {
    // Update the card having the id given in parameter to add a label
    const id = req.params.id
    const labelId = req.params.labelId

    Card.findOneAndUpdate(
        {_id: id},
        {$addToSet: {labels: labelId}},
        {new: true}
    ).then(function(card) {
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(409).send(err)
    })
})

router.put('/:id/label/remove/:labelId', function (req, res, next) {
    // Update the card having the id given in parameter to remove a label
    const id = req.params.id
    const labelId = req.params.labelId

    Card.findOneAndUpdate(
        {_id: id},
        {$pull: {labels: labelId}},
        {new: true}
    ).then(function(card) {
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(409).send(err)
    })
})

router.put('/:id/user/add/:userId', function (req, res, next) {
    // Update the card having the id given in parameter to add a user to it
    const id = req.params.id
    const userId = req.params.userId
    Card.findOneAndUpdate({_id : id},
        {$addToSet: {$users: userId}},
        {new: true}
    ).then(function(card) {
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(409).send(err)
    })
})

router.put('/:id/user/remove/:userId', function (req, res, next) {
    // Update the card having the id given in parameter to remove a user from it
    const id = req.params.id
    const userId = req.params.userId
    Card.findOneAndUpdate({_id : id},
        {$pull: {$users: userId}},
        {new: true}
    ).then(function(card) {
        res.status(200).send(card)
    }).catch(function(err) {
        res.status(409).send(err)
    })
})

router.put('/:id/oldList/:oldlistId/newList/:newlistId/board/:boardId', function (req, res, next) {
    // move a card from one list to another
    const id = req.params.id
    const oldlistId = req.params.oldlistId
    const newlistId = req.params.newlistId
    const boardId = req.params.boardId
    const oldPos = req.body.oldPos
    const newPos = req.body.newPos
    Board.update(
        {_id: boardId, "lists._id": oldlistId},
        {$pull: {"lists.$.cards": {_id: id, pos: oldPos}}},
        (err, result) =>{
            if (err) res.status(409).send("Couldn't delete the card of id " + id + " from the list of id " + oldlistId)
            else if (result.nModified === 0) res.status(404).send("There is no card of id " + id + " in the list of id " + oldlistId)
            else{
                Board.findById(boardId, function(err, data){
                    data.lists.id(oldlistId).cards.forEach((card) => {
                        if (card.pos > oldPos){
                            card.pos--
                        }
                    })
                    data.save((err, result) => {
                        //Couldn't save the new positions, so trying to revert the card deletion
                        if (err){
                            Board.update(
                                {_id: boardId, "lists._id": oldlistId},
                                {$push: {"lists.$.cards": {_id: id, pos: oldPos}}},
                                (err) =>{
                                    if (err) res.status(409).send("Couldn't change the positions of the cards and couldn't revert the deletion of the card")
                                    else res.status(409).send("Couldn't change the positions of the cards but could revert the deletion of the card")
                                }
                            )
                        }
                        //First list saved, now is time to update the other list
                        else{
                            Board.findOneAndUpdate(
                                {_id: boardId, "lists._id": newlistId},
                                {$push: {"lists.$.cards": {_id: id, pos: newPos}}},
                                {new: true},
                                (err, result) =>{
                                    if (err) res.status(409).send("Couldn't create the card of id " + id + " on the list of id " + newlistId)
                                    else {
                                        Board.findById(boardId, function(err, data){
                                            data.lists.id(newlistId).cards.forEach((card) => {
                                                if (card.pos >= newPos && !card._id.equals(id)){
                                                    card.pos++
                                                }
                                            })
                                            data.save().then(() => {
                                                //Couldn't save the new positions, so trying to revert the card addition
                                                if (err){
                                                    Board.findOneAndUpdate(
                                                        {_id: boardId, "lists._id": newlistId},
                                                        {$pull: {"lists.$.cards": {_id: id, pos: newPos}}},
                                                        (err) =>{
                                                            if (err) res.status(409).send("Couldn't change the positions of the cards and couldn't revert the addition of the card")
                                                            else res.status(409).send("Couldn't change the positions of the cards but could revert the addition of the card")
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
router.delete('/:id/list/:listId/board/:boardId', function (req, res, next) {
    const id = req.params.id

    Board.findOne(
        {_id: req.params.boardId}
    )
    .then(function(board) {
        board.lists.id(req.params.listId).cards.pull(board.lists.id(req.params.listId).cards.id(id))
        board.save()
        .then(function() {
            Card.findById(id)
            .then(function(card) {
                const allAttachments = card.attachments.map((attachment) => attachment._id)
                Attachment.remove(
                    {_id: {$in: allAttachments}}
                )
                .then(function() {
                    card.remove()
                    .then(function() {
                        res.status(200).send("The card of id " + id + " was successfully destroyed")
                    }).catch(function(err) {
                        console.log(err)
                        res.status(409).send(err)
                    })
                }).catch(function(err) {
                    console.log(err)
                    res.status(409).send(err)
                })
            }).catch(function(err) {
                console.log(err)
                res.status(404).send(err)
            })
        }).catch(function(err) {
            console.log(err)
            res.status(409).send(err)
        })
    }).catch(function(err) {
        console.log(err)
        res.status(404).send(err)
    })
})

/**
 * Delete all cards from a list
 */
router.delete('/list/:listId/board/:boardId', function (req, res, next) {
    const listId = req.params.listId
    const boardId = req.params.boardId

    Board.findOne(
        {_id: boardId, "lists._id": listId},
        (err, board) => {
            if (err) res.status(404).send(err)
            else if (board === null) res.status(404).send("Couldn't find list of id " + listId + " or the board of id " + boardId)
            else {
                const cardsIds = board.lists.id(listId).cards
                board.lists.id(listId).cards = []

                board.save()
                .then(function() {
                    Card.find(
                        {_id: {$in: cardsIds}}
                    ).then(function(cards) {
                        if (cards === null) res.status(200).send("Successfully destroyed all cards from list " + listId + " in board " + boardId)
                        else {
                            const allAttachments = cards.map((card) => card.attachments._id).reduce((a, b) => a.concat(b), [])
                            Attachment.remove({_id: {$in: allAttachments}})
                            .then(function() {
                                Card.remove(
                                    {_id: {$in: cardsIds}}
                                )
                                .then(function() {
                                    res.status(200).send("Successfully destroyed all cards from list " + listId + " in board " + boardId)
                                }).catch(function(err) {
                                    res.status(409).send(err)
                                })
                            }).catch(function(err) {
                                res.status(409).send(err)
                            })
                        }
                    }).catch(function(err) {
                        res.status(404).send(err)
                    })
                }).catch(function(err) {
                    res.status(409).send(err)
                })
            }
        }
    )
})

module.exports = router