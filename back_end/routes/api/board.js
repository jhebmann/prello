const models = require('../../models')
const Board = models.boards
const Team = models.teams
const Card = models.cards
const router = require('express').Router()
const ObjectId = require('mongodb').ObjectID

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

router.get('/team/:teamId', function (req, res, next) {
    // Get all boards of a team
    Team.findOne(
        {_id: req.params.teamId},
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
    const id = req.params.id

    Board.findById(id)
    .then((board) => {
        let fullBoard = board

        let cardsProcessed = 0

        if (board.lists.length !== 0 && board.lists.map((list) => list.cards.length).reduce((a, b) => a + b, 0) !== 0){
            const allCards = board.lists.map((list) => list.cards.length).reduce((a, b) => a + b, 0)

            fullBoard.lists.forEach((list, listIndex) => {
                list.cards.forEach((card, cardIndex) => {
                    Card.findById(card._id)
                    .then((newCard) => {
                        let haha = {
                            _id: newCard._id,
                            pos: card.pos,
                            title: newCard.title,
                            description: newCard.description,
                            dueDate: newCard.dueDate,
                            doneDate: newCard.doneDate,
                            createdAt: newCard.createdAt,
                            isArchived: newCard.isArchived,
                            users: newCard.users,
                            checklists : newCard.checklists,
                            attachments : newCard.attachments,
                            comments : newCard.comments,
                            labels : newCard.labels
                        }

                        fullBoard.lists[listIndex].cards[cardIndex] = haha

                        cardsProcessed++
                        if(cardsProcessed === allCards) {
                            res.status(200).send(fullBoard)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                })
            })
        } else {
            res.status(200).send(board)
        }
    })
    .catch((err) => {
        console.log(err)
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
/*
router.get('/:id/admins', function (req, res, next) {
    // Get all admins of the board having the id given in parameter
    Board.aggregate([
        {
          $lookup:
            {
            from:"cards",
            localField:"lists.cards._id",
            foreignField:"_id",
            as:"lists.cards"
            }
            }], (err, board) => {
                if (err || board === null) res.status(401).send("Couldn't find the board of id " + id)
                else{
                    res.status(200).send(board)
                }
      });
})
*/
router.get('/:id/users', function (req, res, next) {
    // Get all users of the board having the id given in parameter
    const id = req.params.id
    let allUsers = []

    Board.findOne(
        {_id: id},
        (err, board) => {
            if (err || board === null) res.status(401).send("Couldn't find the board of id " + id)
            else{
                const boardTeams = board.teams
                Team.find(
                    {_id: {$in: boardTeams}},
                    (err, teams) => {
                        if (err) res.status(401).send(err)
                        else if (teams.length === 0) res.status(200).send([])
                        else{
                            teams.forEach((team) => {
                                allUsers = allUsers.concat(team.users)
                            })
                            res.status(200).send(allUsers)
                        }
                    }
                )
            }
        }
    )
})

router.post('/', function (req, res, next) {
    // Post a new board
    const newBoard = new Board({
        title: ('undefined' !== typeof req.body.title && req.body.title !== null) ? req.body.title : '',
        admins: req.body.admins,
        isPublic: req.body.isPublic
    })
    newBoard.save(
        {},
        (err, insertedBoard) => {
            if (err) res.status(401).send(err)
            else {
                console.log("Board of id " + insertedBoard._id + " Added")
                res.status(200).send(insertedBoard)
                }
            }
    )
})

router.post('/team/:teamId', function (req, res, next) {
    // Post a new board
    const newBoard = new Board({
        title: req.body.title,
        admins: req.body.admins,
        isPublic: req.body.isPublic,
        teams: [req.params.teamId]
    })
    newBoard.save(
        {},
        (err, insertedBoard) => {
            if (err) res.status(401).send(err)
            else {
                Team.findOneAndUpdate(
                    {_id: req.params.teamId},
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
    const id = req.params.id
    Board.findOne(
        {
            _id : id,
        },
        (err, board) => {
            if (err) res.status(401).send(err)
            else{
                if ('undefined' !== typeof req.body.title) board.title = req.body.title
                if ('undefined' !== typeof req.body.isPublic) board.isPublic = req.body.isPublic
                board.save((err, board) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The board of id " + id + " has been successfully updated")
                        res.status(200).send(board)
                    }
                })
            }
        }
    )
})

router.put('/:id/toAdmin/:userId', function (req, res, next) {
    // Update the board with the id given in parameter to set the specified user as admin
    const id = req.params.id
    const userId = req.params.userId

    Board.findOne(
        {_id: id}
    )
    .then(function(board) {
        board.admins.addToSet(userId)
        board.save()
        .then(function(board) {
            res.status(200).send(board)
        }).catch(function(err) {
            res.status(401).send(err)
        })
    }).catch(function(err) {
        console.log(err)
        res.status(401).send(err)
    })
})

router.put('/:id/fromAdmin/:userId', function (req, res, next) {
    // Update the board with the id given in parameter to revoke the specified user as admin
    const id = req.params.id
    const userId = req.params.userId

    Board.findOne(
        {_id: id}
    )
    .then(function(board) {
        board.admins.pull(userId)
        board.save()
        .then(function(board) {
            res.status(200).send(board)
        }).catch(function(err) {
            res.status(401).send(err)
        })
    }).catch(function(err) {
        res.status(401).send(err)
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
                            const allCards = allLists.length !== 0 ? allLists.map((l) => l.cards).reduce((a, b) => a.concat(b), []) : []
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