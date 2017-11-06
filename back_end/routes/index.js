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

  /*
  const boardKeys = Object.keys(models.boards.schema.obj)

  let conditions = []

  boardKeys.forEach(function(key){
    conditions.push({[key]: {$regex: text, $options: 'i'}})
  })
  */

  let finalResult = {}
  models.users.findOne(
    {_id: userId},
    (err, user) => {
      if (err) res.status(401).send(err)
      else {
        models.teams.find(
          {
            _id: {$in: user.teams}
          },
          (err, teams) => {
            if (err) res.status(401).send(err)
            else {
              let idAndNames = []
              teams.forEach((team) => {
                if (team.name && team.name.includes(text))
                  idAndNames.push({_id: team._id, name: team.name})
              })
              finalResult.teams = idAndNames

              const allBoards = teams.size === 0 ? [] : teams.map((team) => team.boards).reduce((a, b) => a.concat(b), [])

              // then we search in the boards titles
              models.boards.find(
                {
                  $or: [
                    {_id: {$in: allBoards}},
                    {isPublic: true}
                  ]
                },
                (err, boards) => {
                  if (err) res.status(401).send(err)
                  else if (boards.size === 0) res.status.send([])
                  else {
                    let idAndTitles = []
                    boards.forEach((board) => {
                      if (board.title.includes(text))
                        idAndTitles.push({_id: board._id, title: board.title})
                    })
                    finalResult.boards = idAndTitles

                    const allLists = boards.map((board) => board.lists).reduce((a, b) => a.concat(b), [])

                    idAndTitles = []

                    allLists.forEach((list) => {
                      if (list.title.includes(text))
                        idAndTitles.push({_id: list._id, title: list.title})
                    })

                    finalResult.lists = idAndTitles

                    const allCardsIds = allLists.map((list) => list.cards).reduce((a, b) => a.concat(b), [])

                    console.log(allCardsIds)

                    models.cards.find(
                      {
                        _id: {$in: allCardsIds}
                      },
                      (err, cards) => {
                        if (err) res.status(401).send(err)
                        else {
                          idAndTitles = []
                          cards.forEach((card) => {
                            if (card.title.includes(text) && card.description.includes(text)){
                              idAndTitles.push({_id: card._id, title: card.title, description: card.description})
                            } else if (card.title.includes(text)){
                              idAndTitles.push({_id: card._id, title: card.title})
                            } else if (card.description.includes(text)){
                              idAndTitles.push({_id: card._id, description: card.description})
                            }
                          })
                          finalResult.cards = idAndTitles
                          
                          console.log(finalResult)
                          res.status(200).send(finalResult)
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

module.exports = router