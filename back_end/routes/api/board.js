const Board = require('../../models').boards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    // Get all boards
    Board.find().then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    // Get the board having the id given in parameter
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:boardId/admins', function (req, res, next) {
    // Get all admins of the board having the id given in parameter
})

router.post('/', function (req, res, next) {
    // Post a new board
    Board.create({
        title: req.body.title,
        admins: req.body.admins,
        isPublic: req.body.isPublic
    }).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id', function (req, res, next) {  // Not done
    // Update the board having the id given in parameter
    Board.findOneAndUpdate({_id : req.params.id},
        {
            "title": ('undefined' !== typeof req.body.title) ? req.body.title : null ,
            "isPublic" : ('undefined' !== typeof req.body.isPublic) ? req.body.isPublic : null
        }
    ).then(function() {
        res.status(200).send("Successfully updated")
    }).catch(function(err) {
        res.send(err)
    })
})

router.delete('/:id', function (req, res, next) {
    // Delete having the id given in parameter
    Board.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/', function (req, res, next) {
    // Delete all boards
    Board.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

module.exports = router