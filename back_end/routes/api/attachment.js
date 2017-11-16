const models = require('../../models')
const Attachment = models.attachments
const Card = models.cards
const Comment = models.comments
const User = models.users
const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')

router.get('/:id', function (req, res, next) {
    // Return the attachment having the id given in parameter
    const id = req.params.id

    Attachment.findById(id)
    .then(function(attachment){
        res.contentType(attachment.contentType)
        res.status(200).send(attachment.data.toString('base64'))
    }).catch(function(err) {
        console.log(err)
        res.status(401).send(err);
    })
})

router.get('/:id/card/:cardId/user', function (req, res, next) {
    // Get user that posted the attachment
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "attachments._id": id}
    )
    .then(function(card){
        User.findById(card.attachments.id(id).postedBy, {"local.password": 0, "ldap.password": 0})
        .then(function(user){
            res.status(200).send(user)
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id/card/:cardId/comment', function (req, res, next) {
    // Get comment linked to the attachment
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {_id: cardId, "attachments._id": id}
    )
    .then(function(card){
        res.status(200).send(card.comments.id(card.attachments.id(id).linkedComment))
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

const fileParams = multer(
    {
        dest: __dirname + '/upload',
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'))
            }
            cb(null, true)
        }
    }
)

router.post('/card/:cardId', fileParams.single('attachment'), function (req, res, next) {
    // Post a new attachment into a card
    if ('undefined' === typeof req.file){
        console.log("No file provided")
        res.status(401).send("No file provided")
    }
    else {
        Card.findById(req.params.cardId, function(err, card){
            let newAttachment = new Attachment()
            newAttachment.data = fs.readFileSync(req.file.path)
            newAttachment.contentType = req.file.mimetype
            newAttachment.save()
            .then(function(attachment){
                let newAttachmentInfos = {}
                newAttachmentInfos._id = attachment._id
                newAttachmentInfos.datePost = ('undefined' !== typeof req.body.datePost) ? req.body.datePost : Date.now()
                newAttachmentInfos.title = ('undefined' !== typeof req.body.title) ? req.body.title : ''
                newAttachmentInfos.postedBy = req.body.postedBy
                newAttachmentInfos.linkedComment = ('undefined' === typeof req.body.linkedComment) ? req.body.linkedComment : null
                
                card.attachments.push(newAttachmentInfos)
                card.save()
                .then(function(){
                    res.contentType(newAttachment.contentType)
                    res.status(200).send({image: newAttachment.data.toString('base64'), _id: newAttachment._id})
                }).catch(function(err) {
                    console.log(err)
                    res.status(401).send(err);
                })
            }).catch(function(err) {
                console.log(err)
                res.status(401).send(err);
            })
        })
    }
})

router.put('/:id/card/:cardId', function (req, res, next) {
    // Update the attachment having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {
            _id : cardId,
            attachments: {$elemMatch: {_id: id}}
        }
    )
    .then(function(card){
        if ('undefined' !== typeof req.body.title) card.attachments.id(id).title = req.body.title
        card.save()
        .then(function(card){
            console.log("The attachment of id " + id + " has been successfully updated")
            res.status(200).send(card.attachments[card.attachments.length - 1])
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.delete('/:id/card/:cardId', function (req, res, next) {
    // Delete the attachment having the id given in parameter
    const id = req.params.id
    const cardId = req.params.cardId

    Card.findOne(
        {
            _id : cardId,
            attachments: {$elemMatch: {_id: id}}
        }
    )
    .then(function(card){
        card.attachments.pull(id)
        card.save()
        .then(function(card){
            Attachment.findOneAndRemove({_id: id})
            .then(function(){
                console.log("The attachment of id " + id + " has been successfully deleted")
                res.status(200).send("The attachment of id " + id + " has been successfully deleted")
            }).catch(function(err) {
                res.status(401).send(err);
            })
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})



module.exports = router