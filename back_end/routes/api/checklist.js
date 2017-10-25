const Checklist = require('../../models').checklists
const router = require('express').Router()

router.get('/:id', function (req, res, next) {
    // Get the checklist having the id given in parameter
    Checklist.findById(req.params.id).then(function(checklist){
        res.status(200).send(checklist)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.post('/', function (req, res, next) {
    // Post a new checklist
    
})

router.put('/:id', function (req, res, next) {
    // Update the checklist having the id given in parameter
    
})

router.delete('/:id', function (req, res, next) {
    // Delete the checklist having the id given in parameter
    
})



module.exports = router