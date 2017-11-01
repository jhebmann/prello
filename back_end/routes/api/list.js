const List = require('../../models').lists
const Board = require('../../models').boards
const Card = require('../../models').cards
const router = require('express').Router()

// Done

router.get('/:id/board/:boardId', function (req, res, next) {
    // Get the list having the id given in parameter
    Board.findOne(
        {
            _id: req.params.boardId, 
            'lists._id': req.params.id
        },
        {"lists.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send(err);
            else res.status(200).send(board.lists[0])
        }
    )
})

router.get('/:id/board/:boardId/cards', function (req, res, next) {
    // Get the cards in the list and board having the id given in parameter
    Board.findOne({_id: req.params.boardId, "lists._id": req.params.id}, {"lists.$": 1, _id: 0},
        (err, board) => {
            if (board === null)
                res.status(401).send(err)
            else {
                const cards = board.lists[0].cards
                const cardsIds = cards.map((card) => card._id)
                Card.find(
                    {_id: {$in: cardsIds}},
                    (err, cards) => {
                        res.status(200).send(cards)
                    }
                )
            }
        }
    )
})

router.post('/board/:boardId', function (req, res, next) {
    // Post a new list
    Board.findById(req.params.boardId, function(err, board){
        let newList = new List()
        newList.title = req.body.title,
        newList.pos = req.body.pos
        board.lists.push(newList)
        board.save()
        .then(function(board){
            res.status(200).send(board.lists[board.lists.length - 1])
        }).catch(function(err) {
            res.status(401).send(err);
        })
    })
})

router.put('/:id/board/:idBoard', function (req, res, next) {
    // Update the list having the id given in parameter and that is contained in the board having the id given in parameter
    const id = req.params.id
    const idBoard = req.params.idBoard
    Board.findOne(
        {
            _id : idBoard,
            lists: {$elemMatch: {_id: id}}
        },
        (err, board) => {
            if ('undefined' !== typeof req.body.pos) board.lists.id(id).pos = req.body.pos
            if ('undefined' !== typeof req.body.title) board.lists.id(id).title = req.body.title
            board.save()
        }
    ).then(function(board) {
        console.log("The list of id " + id + " has been successfully updated")
        res.status(200).send(board.lists.filter(function(list){
            return String(list._id) === req.params.id
        })[0])
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

/**
 * Delete the list with the specified id
 */
router.delete('/:id/board/:idBoard', function (req, res, next) {
    Board.findOne(
        {_id: req.params.idBoard, "lists._id": req.params.id},
        {"lists.$.cards": 1, _id: 0},
        (err, board) => {
            const list = board.lists[0]
            Board.findOneAndUpdate(
                {_id: req.params.idBoard},
                {$pull: {lists: list}},
                (err) => {
                    if (err) throw err
                    Card.remove(
                        {_id: {$in: list.cards}}
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

module.exports = router