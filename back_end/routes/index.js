const router = require('express').Router()
const models = require('../models')

router.use('/user', require('./api/user'))
router.use('/team', require('./api/team'))
router.use('/board', require('./api/board'))
router.use('/list', require('./api/list'))
router.use('/card', require('./api/card'))
router.use('/checklist', require('./api/checklist'))
router.use('/item', require('./api/item'))
router.use('/attachment', require('./api/attachment'))
router.use('/comment', require('./api/comment'))
router.use('/label', require('./api/label'))

router.get('/', function (req, res) {
  res.status(200).json({ tag: '[† RIP APPLE †]'})
})

router.get('/search/:text/user/:userId', function(req, res) {
  const text = req.params.text
  const userId = req.params.userId

  console.log("The user of id " + userId + " is searching for the text " + text)

  let finalResult = {}

  models.users.findById(userId)
  .then(function(user){
    models.teams.find({_id: {$in: user.teams}})
    .then(function(teams){
      let idsAndNames = []
      teams.forEach((team) => {
        if (team.name && team.name.includes(text))
          idsAndNames.push({_id: team._id, name: team.name})
      })
      finalResult.teams = idsAndNames

      const allBoards = teams.size === 0 ? [] : teams.map((team) => team.boards).reduce((a, b) => a.concat(b), [])

      models.boards.find(
        {$or: [
            {_id: {$in: allBoards}},
            {isPublic: true}
          ]}
      )
      .then(function(boards){
        let idsAndTitles = []
        let listIdsAndTitles = []
        boards.forEach((board) => {
          if (board.title.includes(text))
            idsAndTitles.push({_id: board._id, title: board.title, isPublic: board.isPublic})
          board.lists.forEach((list) => {
            if (list.title.includes(text))
              listIdsAndTitles.push({boardId: board._id, title: list.title, _id: list._id})
          })
        })
        finalResult.boards = idsAndTitles
        finalResult.lists = listIdsAndTitles

        const allLists = boards.map((board) => board.lists).reduce((a, b) => a.concat(b), [])
        const allCardsIds = allLists.map((list) => list.cards).reduce((a, b) => a.concat(b), [])

        models.cards.find(
          {_id: {$in: allCardsIds}}
        )
        .then(function(cards){

          idsAndTitles = []

          cards.forEach((card) => {
            boards.forEach((board) => {
              board.lists.forEach((list) => {
                list.cards.forEach((cardIdAndPos) => {
                  if (card._id.equals(cardIdAndPos._id)){
                    if (card.title.includes(text) || card.description.includes(text)){
                      idsAndTitles.push({boardId: board._id, _id: card._id, title: card.title, description: card.description})
                    }
                  }
                })
              })
            })
          })

          finalResult.cards = idsAndTitles

          console.log(idsAndTitles)

          if (cards.length !== 0) {
            const allComments = cards.map((card) => card.comments).reduce((a, b) => a.concat(b), [])
            let idsAndContents = []
            allComments.forEach((comment) => {
              if (comment.content.includes(text)){
                idsAndContents.push({_id: comment._id, content: comment.content})
              }
            })
            finalResult.comments = idsAndContents
            
            const allAttachments = cards.map((card) => card.attachments).reduce((a, b) => a.concat(b), [])
            idsAndTitles = []
            allAttachments.forEach((attachment) => {
              if (attachment.title.includes(text)){
                idsAndTitles.push({_id: attachment._id, title: attachment.title})
              }
            })
            finalResult.attachments = idsAndTitles

            const allChecklists = cards.map((card) => card.checklists).reduce((a, b) => a.concat(b), [])
            idsAndTitles = []
            allChecklists.forEach((checklist) => {
              if (checklist.title.includes(text)){
                idsAndTitles.push({_id: checklist._id, title: checklist.title})
              }
            })
            finalResult.checklists = idsAndTitles

            if (allChecklists.size !== 0){
              const allItems = allChecklists.map((checklist) => checklist.items).reduce((a, b) => a.concat(b), [])
              idsAndTitles = []
              allItems.forEach((item) => {
                if (item.title.includes(text)){
                  idsAndTitles.push({_id: item._id, title: item.title})
                }
              })
              finalResult.items = idsAndTitles
            } else {
              finalResult.items = []
            }
          } else {
            finalResult.comments = []
            finalResult.attachments = []
            finalResult.checklists = []
            finalResult.items = []
          }
          res.status(200).send(finalResult)
        }).catch(function(err) {
            res.status(401).send(err);
        })
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