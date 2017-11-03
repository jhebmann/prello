const models = require('../../models')
const Board = models.boards
const Label = models.labels
const Card = models.cards
const router = require('express').Router()

router.get('/:id/board/:boardId', function (req, res, next) {
    // Get the label having the id given in parameter
    Board.findOne(
        {
            _id: req.params.boardId, 
            'labels._id': req.params.id
        },
        {"labels.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send(err);
            else res.status(200).send(board.labels[0])
        }
    )
})

router.post('/board/:idBoard', function (req, res, next) {
    // Post a new label
    Board.findById(req.params.idBoard, function(err, board){
        let newLabel = new Label()
        newLabel.title = req.body.title,
        newLabel.color = req.body.color
        board.labels.push(newLabel)
        board.save()
        .then(function(board){
            res.status(200).send(board.labels[board.labels.length - 1])
        }).catch(function(err) {
            res.status(401).send(err);
        })
    })
})

router.put('/:id/board/:idBoard', function (req, res, next) {
    // Update the label having the id given in parameter and that is contained in the board having the id given in parameter
    const id = req.params.id
    const idBoard = req.params.idBoard
    Board.findOne(
        {
            _id : idBoard,
            labels: {$elemMatch: {_id: id}}
        },
        (err, board) => {
            if (err) res.status(401).send(err)
            else{
                if ('undefined' !== typeof req.body.color) board.labels.id(id).color = req.body.color
                if ('undefined' !== typeof req.body.title) board.labels.id(id).title = req.body.title
                board.save((err, board) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The label of id " + id + " has been successfully updated")
                        res.status(200).send(board.labels.id(id))
                    }                
                })
            }
        }
    )
})

/**
 * Delete the label with the specified id
 */
router.delete('/:id/board/:idBoard', function (req, res, next) {
    const id = req.params.id
    const idBoard = req.params.idBoard
    Board.findOne(
        {_id: idBoard, "labels._id": id},
        {"labels.$": 1, _id: 0},
        (err, board) => {
            if (err) res.status(401).send(err)
            else {
                const label = board.labels[0]
                Board.findOneAndUpdate(
                    {_id: idBoard},
                    {$pull: {labels: label}},
                    (err) => {
                        if (err) throw err
                        else {
                            Card.update(
                                {},
                                {$pull: {labels: id}},
                                {multi: true},
                                (err) => {
                                    if (err) res.status(401).send(err)
                                    else res.status(200).send("Successfully deleted the label of id " + id)
                                }
                            )
                        }
                    }
                )
            }
        }
    )
})

router.delete('/', function (req, res, next) {
    Board.update(
        {},
        {$set: {"labels": []}},
        {multi: true},
        (err, board) => {
            if (err) res.status(401).send(err)
            else {
                Card.update(
                    {},
                    {$set: {labels: []}},
                    {multi: true},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else res.status(200).send("Successfully deleted all labels")
                    }
                )
            }
        }
    )
})


module.exports = router