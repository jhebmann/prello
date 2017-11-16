const List = require('../../models').lists
const Board = require('../../models').boards
const Card = require('../../models').cards
const router = require('express').Router()

// Done

router.get('/:id/board/:boardId', function (req, res, next) {
    // Get the list having the id given in parameter
    const id = req.params.id
    const boardId = req.params.boardId
    Board.findOne(
        {
            _id: boardId,
            'lists._id': id
        },
        {"lists.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send(err)
            else if (board === null) res.status(401).send("Couldn't find the board of id " + boardId + " or the list of id " + id)
            else res.status(200).send(board.lists[0])
        }
    )
})

router.get('/:id/board/:boardId/cards', function (req, res, next) {
    // Get the cards in the list and board having the id given in parameter
    let cardsWithPos = []
    const id = req.params.id
    const boardId = req.params.boardId
    Board.findOne(
        {_id: boardId, "lists._id": id},
        {"lists.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send(err)
            else if (board === null) res.status(401).send("Couldn't find the board of id " + boardId + " or the list of id " + id)
            else {
                const cardsIdPos = board.lists[0].cards
                if (cardsIdPos.length === 0) res.status(200).send([])
                else {
                    const cardsIds = cardsIdPos.map((card) => card._id)
                    Card.find(
                        {_id: {$in: cardsIds}},
                        (err, cards) => {
                            cards.forEach(function(card){
                                cardsIdPos.forEach(function(cardIdPos){
                                    if (cardIdPos._id.equals(card._id)){
                                        let newCard = JSON.parse(JSON.stringify(card))
                                        newCard.pos = cardIdPos.pos
                                        cardsWithPos.push(newCard)
                                    }
                                })
                            })
                        }
                    ).then(function(){
                        res.status(200).send(cardsWithPos)
                    }).catch(function(err) {
                        res.status(401).send(err)
                    })
                }
            }
        }
    )
})

router.post('/board/:boardId', function (req, res, next) {
    // Post a new list

    const boardId = req.params.boardId
    let maxPos = -1

    Board.findOne(
        {_id: boardId},
        (err, board) => {
            if (err) res.status(401).send(err)
            else if (board === null) res.status(401).send("Couldn't find the board of id " + boardId)
            else{
                board.lists.forEach((list) => {
                    if (list.pos > maxPos)
                        maxPos = list.pos
                })
            }
        }
    ).then(function(board){
        const newList = new List()
        newList.title = ('undefined' !== typeof req.body.title) ? req.body.title : "",
        newList.pos = maxPos + 1
        board.lists.push(newList)
        board.save().then(function(board){
            res.status(200).send(board.lists[board.lists.length - 1])
        }).catch(function(err) {
            res.status(401).send(err)
        })
    }).catch(function(err){
        res.status(401).send(err)
    })
})

router.put('/:id/board/:boardId', function (req, res, next) {
    // Update the list having the id given in parameter and that is contained in the board having the id given in parameter
    const id = req.params.id
    const boardId = req.params.boardId
    Board.findOne(
        {
            _id : boardId,
            lists: {$elemMatch: {_id: id}}
        },
        (err, board) => {
            if (err) res.status(401).send(err)
            else if (board === null) res.status(401).send("Couldn't find the board of id " + boardId + " or the list of id " + id)
            else {
                if ('undefined' !== typeof req.body.pos) board.lists.id(id).pos = req.body.pos
                if ('undefined' !== typeof req.body.title) board.lists.id(id).title = req.body.title
                board.save((err, board) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The list of id " + id + " has been successfully updated")
                        res.status(200).send(board.lists.id(id))
                    }                
                })
            }
        }
    )
})

/**
 * Delete the list with the specified id
 */
router.delete('/:id/board/:boardId', function (req, res, next) {
    const id = req.params.id
    const boardId = req.params.boardId
    
    Board.findOne(
        {_id: boardId, "lists._id": id},
        {"lists.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send(err)
            else if (board === null) res.status(401).send("Couldn't find the board of id " + boardId + " or the list of id " + id)
            else {
                const list = board.lists[0]
                Board.findOneAndUpdate(
                    {_id: boardId},
                    {$pull: {lists: list}},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else {
                            Card.remove(
                                {_id: {$in: list.cards}}
                            ).then(function() {
                                console.log("The list of id " + id + " has been successfully destroyed")
                                res.status(200).send("Successfully destroyed")
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

module.exports = router
