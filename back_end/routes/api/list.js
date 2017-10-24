const lists = require('../../models').lists
const boards = require('../../models').boards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    lists.find().then(function(list){
        res.status(200).send(list)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    lists.findById(req.params.id).then(function(list){
        res.status(200).send(list)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.post('/', function (req, res, next) {
    lists.create(
        {title: req.body.title}
    ).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/', function (req, res, next) { // Not good
    boards.findOneAndUpdate(
        {_id : req.body.boardId, lists: {$elemMatch: {_id: req.body.listId}}},
        {"lists.$.title": req.body.newTitle}
    ).then(function() {
        res.status(200).send(res);
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/:id', function (req, res, next) {
    lists.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/', function (req, res, next) {
    lists.remove
})

module.exports = router