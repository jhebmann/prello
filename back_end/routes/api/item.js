const Item = require('../../models').items
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Item.find().then(function(item){
        res.status(200).send(item)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Item.findById(req.params.id).then(function(item){
        res.status(200).send(item)
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