const models = require('../../models')
const Board = models.boards
const Team = models.teams
const router = require('express').Router()
const ObjectId = require('mongodb').ObjectID;

router.get('/', function (req, res, next) {
    // Get all boards
    Board.find().then(function(boards){
        res.status(200).send(boards)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.get('/user', function (req, res, next) {
    // Get all boards of a user
    console.log('Getting boards from User ID '+req.query.user)
    Board.find(
        {$or:[
            {users:ObjectId(req.query.user)},
            {'isPublic':true}
        ]}
    ).then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.get('/team/:idTeam', function (req, res, next) {
    // Get all boards of a team
    Team.findOne(
        {_id: req.params.idTeam},
        (err, team) => {
            if (err) res.status(401).send(err)
            else{
                Board.find(
                    {_id:{$in: team.boards}},
                    (err, boards) => {
                        if (err) res.status(401).send(err)
                        else res.status(200).send(boards)
                    }
                )
            }
        }
    )
})

router.get('/public', function (req, res, next) {
    // Get all public boards
    Board.find(
        {isPublic: true}
    ).then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.get('/:id', function (req, res, next) {
    // Get the board having the id given in parameter
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.get('/:id/lists', function (req, res, next) {
    // Get the lists of the board having the id given in parameter
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board.lists)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.get('/:id/labels', function (req, res, next) {
    // Get the labels of the board having the id given in parameter
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board.labels)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.get('/:id/admins', function (req, res, next) {
    // Get all admins of the board having the id given in parameter
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board.admins)
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.post('/team/:idTeam', function (req, res, next) {
    // Post a new board
    const newBoard = new Board({
        title: req.body.title,
        admins: req.body.admins,
        isPublic: req.body.isPublic
    })
    newBoard.save(
        {},
        (err, insertedBoard) => {
            if (err) res.status(401).send(err)
            else {
                Team.findOneAndUpdate(
                    {_id: req.params.idTeam},
                    {$push: {boards: insertedBoard._id}},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else {
                            console.log("Board of id " + insertedBoard._id + " Added")
                            res.status(200).send(insertedBoard)
                        }
                    }
                )
            }
        }
    )
})

router.put('/:id', function (req, res, next) {  
    // Update the board having the id given in parameter
    Board.findOneAndUpdate({_id : req.params.id},
        {
            "title": ('undefined' !== typeof req.body.title) ? req.body.title : undefined ,
            "isPublic" : ('undefined' !== typeof req.body.isPublic) ? req.body.isPublic : undefined
        },
        {new: true}
    ).then(function(board) {
        res.status(200).send(board)
    }).catch(function(err) {
        res.send(err)
    })
})

router.delete('/:id', function (req, res, next) {
    //delete the board of the given id
    const id = req.params.id
    Board.findOne(
        {_id: id},
        (err, board) => {
            if (board === null)
                res.status(401).send("No board of id " + req.params.id + " could be found")
            else if(err) res.status(401).send(err)
            else {
                Team.update(
                    {},
                    {$pull: {boards: id}},
                    {multi: true},
                    (err) => {
                        if(err) res.status(401).send(err)
                        else{
                            const allLists = board.lists
                            const allCards = allLists.length !== 0 ? allLists.map((l) => l.cards).reduce((a, b) => a.concat(b),0) : []
                            models.cards.remove(
                                {_id: {$in: allCards}},
                                (err) => {
                                    if (err) res.status(401).send("Couldn't delete the cards of the board with id " + board._id)
                                    Board.remove(
                                        {_id: board._id}
                                    ).then(function() {
                                        res.status(200).send("The board of id " + id + " was successfully destroyed")
                                    }).catch(function(err) {
                                        res.status(401).send(err)
                                    })
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
    //Delete all the boards
    Board.find(
        {},
        (err, boards) => {
            if (err) res.status(401).send(err)
            else{
                Team.update(
                    {},
                    {$set: {boards: []}},
                    {multi: true},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else{
                            const allLists = boards.length !== 0 ? boards.map(b => b.lists).reduce((a, b) => a.concat(b)) : []
                            const allCards = allLists.length !== 0 ? allLists.map((l) => l.cards).reduce((a, b) => a.concat(b)) : []
                            models.cards.remove(
                                {_id: {$in: allCards}},
                                (err) => {
                                    const boardsIds = boards.length !== 0 ? boards.map((b) => b._id) : []
                                    Board.remove(
                                        {_id: {$in: boardsIds}}
                                    ).then(function() {
                                        res.status(200).send("All boards were successfully destroyed")
                                    }).catch(function(err) {
                                        res.status(401).send(err)
                                    })
                                }
                            )
                        }
                    }
                )
            }
        }
    )
})
module.exports = router