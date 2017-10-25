const Item = require('../../models').items
const router = require('express').Router()

router.get('/:id', function (req, res, next) {
    // Get the item having the id given in parameter
    Item.findById(req.params.id).then(function(item){
        res.status(200).send(item)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.post('/', function (req, res, next) {
    // Post a new item
    
})

router.put('/:id', function (req, res, next) {
    // Update the item having the id given in parameter
    
})

router.delete('/:id', function (req, res, next) {
    // Delete the item having the id given in parameter
    
})

module.exports = router