const List = require('../../models').lists
const Board = require('../../models').boards
const Card = require('../../models').cards
const router = require('express').Router()

// Done

router.get('/:id', function (req, res, next) {
    // Return the board id and the list having the id given in parameter
    Board.findOne({'lists._id': req.params.id}, '-_id').select({ lists: {$elemMatch: {_id: req.params.id}}})
    .then(function(listsMatching){
        res.status(200).send(listsMatching.lists[0])
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:listId/board/:boardId/card', function (req, res, next) {
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

router.put('/:listId/board/:boardId', function (req, res, next) { // Not good
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
    List.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

module.exports = router