const Board = require('../../models').boards
const router = require('express').Router()

router.get('/', function (req, res, next) {
    Board.find().then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/:id', function (req, res, next) {
    Board.findById(req.params.id).then(function(board){
        res.status(200).send(board)
    }).catch(function(err) {
        res.status(401).send(err.getMessage());
    })
})

router.get('/team/:teamId', function (req, res, next) {

})

router.post('/', function (req, res, next) {
    Board.create({
        title: req.body.title,
        admins: req.body.admins,
        isPublic: req.body.isPublic
    }).then(function() {
        res.status(200).send("Successfully created");
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id', function (req, res, next) {  // Not done
    Board.findOneAndUpdate({_id : req.params.id},
        {
            "title": ('undefined' !== typeof req.body.title) ? req.body.title : null ,
            "isPublic" : ('undefined' !== typeof req.body.isPublic) ? req.body.isPublic : null
        }
    ).then(function() {
        res.status(200).send("Successfully updated")
    }).catch(function(err) {
        res.send(err)
    })
})

router.delete('/:id', function (req, res, next) {
    Board.findByIdAndRemove(req.params.id).then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

router.delete('/', function (req, res, next) {
    Board.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})

module.exports = router