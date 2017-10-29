const Label = require('../../models').labels
const router = require('express').Router()

router.get('/', function (req, res, next) {
    // Get all the labels
    Label.find().then(function(label){
        res.status(200).send(label)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    // Get the label having the id given in parameter
    Label.findById(req.params.id).then(function(label){
        res.status(200).send(label)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.post('/', function (req, res, next) {
    // Post a new label
    const newLabel = new Label({
        title: req.body.title,
        color: req.body.color
    })
    newLabel.save(
        {},
        (err, insertedLabel) => {
            if (err)
                res.status(401).send(err)
            else {
                console.log("Label added")
                res.status(200).send(insertedLabel)
            }
        }
    )
})

router.put('/:id', function (req, res, next) {
    // Update the label having the id given in parameter
    
})

router.delete('/:id', function (req, res, next) {
    // Delete the label having the id given in parameter
    
})

router.delete('/', function (req, res, next) {
    // Delete all labels
    
})


module.exports = router