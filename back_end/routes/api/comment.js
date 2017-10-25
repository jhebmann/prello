const Comment = require('../../models').comments
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Comment.find().then(function(comment){
        res.status(200).send(comment)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Comment.findById(req.params.id).then(function(comment){
        res.status(200).send(comment)
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


module.exports = router