const List = require('../../models').lists
const Board = require('../../models').boards
const Card = require('../../models').cards
const router = require('express').Router()

// Done


router.get('/:id', function (req, res, next) {
    // Get the list having the id given in parameter
    Board.findOne({'lists._id': req.params.id}, 'lists')
    .then(function(board){
        const list = board.lists.filter(function(list) {
            return list._id == req.params.id
        })[0]
        res.status(200).send(list)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:listId/cards', function (req, res, next) {
    // Get the cards in the list and board having the id given in parameter
    Board.findOne({"lists._id": req.params.listId}, 'lists',
        (err, board) => {
            if (board === null)
                res.status(401).send(err)
            else {
            Card.find(
                {_id: {$in: board.lists[0].cards}},
                (err, cards) => {
                    res.status(200).send(cards)
                }
            )}
        }
    )
})

router.post('/', function (req, res, next) {
    // Post a new list
    Board.findById(req.body.boardId, function(err, board){
        let newList = new List()
        newList.title = req.body.title,
        newList.pos = req.body.pos
        board.lists.push(newList)
        board.save()
        .then(function(board){
            console.log(board.lists)
            res.status(200).send(board.lists[board.lists.length - 1])
        }).catch(function(err) {
            res.status(401).send(err);
        })
    })
})

router.put('/:id', function (req, res, next) {
    // Update the list having the id given in parameter and that is contained in the board having the id given in parameter
    Board.findOneAndUpdate(
        {'lists._id': req.params.id},
        {
            "lists.$.pos": ('undefined' !== typeof req.body.pos) ? req.body.pos : null ,
            "lists.$.title" : ('undefined' !== typeof req.body.title) ? req.body.title : null
        }
    ).then(function(board){
        const list = board.lists.filter(function(list) {
            return list._id == req.params.id
        })[0]
        res.status(200).send(list)
    }).catch(function(err) {
        res.status(401).send(err);
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