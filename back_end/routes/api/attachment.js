const Attachment = require('../../models').attachments
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Attachment.find().then(function(attachment){
        res.status(200).send(attachment)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Attachment.findById(req.params.id).then(function(attachment){
        res.status(200).send(attachment)
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