const List = require('../../models').lists
const Board = require('../../models').boards
const Card = require('../../models').cards
const router = require('express').Router()

// Done

router.get('/:id', function (req, res, next) {
    // Get the list having the id given in parameter
    Board.findOne({'lists._id': req.params.id}, '-_id').select({ lists: {$elemMatch: {_id: req.params.id}}})
    .then(function(listsMatching){
        res.status(200).send(listsMatching.lists[0])
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:listId/board/:boardId/cards', function (req, res, next) {
    // Get the cards in the list and board having the id given in parameter
    Board.findOne({_id: req.params.boardId, "lists._id": req.params.listId}, 'lists',
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
    }).then(function(){
        res.status(200).send("Successfully created")
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:listId/board/:boardId', function (req, res, next) {
    // Update the list having the id given in parameter and that is contained in the board having the id given in parameter
    Board.findOneAndUpdate({
        _id : req.params.boardId, 
        lists: {$elemMatch: {_id: req.params.listId}}},
        {
            "lists.$.pos": ('undefined' !== typeof req.body.pos) ? req.body.pos : null ,
            "lists.$.title" : ('undefined' !== typeof req.body.title) ? req.body.title : null
        }
    ).then(function() {
        res.status(200).send("Successfully updated")
    }).catch(function(err) {
        res.send(err)
    })
})

router.delete('/:id', function (req, res, next) {
    // Delete the list having the id given in parameter
    List.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

module.exports = router