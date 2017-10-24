const Label = require('../../models').labels
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Label.find().then(function(label){
        res.status(200).send(label)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Label.findById(req.params.id).then(function(label){
        res.status(200).send(label)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.post('/', function (req, res, next) {
    Label.create(
        {} // add parameters
    ).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send("Error", err);
    })
})

router.put('/:id', function (req, res, next) {
    Label.findByIdAndUpdate(req.params.id, {$set: {}}).then(function() {//define what to add
        res.status(200).send("Successfully updated");
    }).catch(function(err) {
        res.status(401).send("Error", err);
    });
})

router.delete('/:id', function (req, res, next) {
    Label.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send("Error", err);
    });
})

router.delete('/all', function (req, res, next) {
    Label.remove
})

module.exports = router