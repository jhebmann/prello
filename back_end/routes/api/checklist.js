const Checklist = require('../../models').checklists
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Checklist.find().then(function(checklist){
        res.status(200).send(checklist)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Checklist.findById(req.params.id).then(function(checklist){
        res.status(200).send(checklist)
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