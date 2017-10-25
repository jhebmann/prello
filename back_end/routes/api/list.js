const List = require('../../models').lists
const Board = require('../../models').boards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    List.find().then(function(list){
        res.status(200).send(list)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    List.findById(req.params.id).then(function(list){
        res.status(200).send(list)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.post('/', function (req, res, next) {
    List.create(
        {title: req.body.title}
    ).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:listId/board/:boardId', function (req, res, next) { // Not good
    let newList = {}
    if ('undefined' !== typeof req.body.pos) newList.pos = req.body.pos
    if ('undefined' !== typeof req.body.title) newList.title = req.body.title
    Board.findOneAndUpdate({
        _id : req.params.boardId, 
        list: {$elemMatch: {_id: req.params.listId}}},
        {newList}        
    ).then(function() {
        res.json({message: "List updated"})
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

router.delete('/all', function (req, res, next) {
    List.remove().then(function() {
        res.status(200).send("Successfully destroyed")
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

module.exports = router