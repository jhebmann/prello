const Board = require('../../models').boards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Board.find().then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.post('/', function (req, res, next) {
    Board.create({
        title: req.body.title,
        lists: [],
        admins: req.body.admins,
        isPublic: true
    }).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id', function (req, res, next) {
    Board.findByIdAndUpdate(req.params.id, {$set: {}}).then(function() {//define what to add
        res.status(200).send("Successfully updated");
    }).catch(function(err) {
        res.status(401).send("Error", err);
    });
})

router.delete('/:id', function (req, res, next) {
    Board.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send("Error", err);
    });
})

router.delete('/all', function (req, res, next) {
    Board.remove
})

module.exports = router