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
    
})

router.put('/:id', function (req, res, next) {
    
})

router.delete('/:id', function (req, res, next) {
    
})

router.delete('/all', function (req, res, next) {
    
})


module.exports = router