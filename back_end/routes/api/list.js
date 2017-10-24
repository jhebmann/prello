const List = require('../../models').lists
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

router.put('/:id', function (req, res, next) {
    List.findByIdAndUpdate(req.params.id, {$set: {"title": req.body.newTitle}}).then(function() {
        res.status(200).send("Successfully updated");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/:id', function (req, res, next) {
    List.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/', function (req, res, next) {
    List.remove
})

module.exports = router