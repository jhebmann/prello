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
  res.status(200).json({ tag: '❤♡❤ APPLE ❤♡❤'})
})

router.get('/search/:text', function(req, res) {
  const text = req.params.text

  /*
  const boardKeys = Object.keys(models.boards.schema.obj)

  let conditions = []

  boardKeys.forEach(function(key){
    conditions.push({[key]: {$regex: text, $options: 'i'}})
  })
  */

  let finalResult = []

  // We first search in the boards titles
  models.boards.find(
    {title: {$regex: text, $options: 'i'}},
    (err, boards) => {
      if (err) res.status(401).send(err)
      else {
        let idAndTitles = []
        boards.forEach((board) => {
          idAndTitles.push({_id: board._id, title: board.title})
        })
        finalResult.push({boards: idAndTitles})

        //then we search in the lists titles
        models.boards.find(
          {"lists.title": {$regex: text, $options: 'i'}},
          {"lists.$": 1},
          {multi: true},
          (err, boards) => {
            if (err) res.status(401).send(err)
            else {
              idAndTitles = []
              boards.forEach((board) => {
                board.lists.forEach((list) => {
                  idAndTitles.push({_id: list._id, title: list.title})
                })
              })
              finalResult.push({lists: idAndTitles})
              
              //Then we search in the cards names and titles
              models.cards.find(
                {$or: [{title: {$regex: text, $options: 'i'}}, {description: {$regex: text, $options: 'i'}}]},
                (err, cards) => {
                  if (err) res.status(401).send(err)
                  else {
                    idAndTitles = []
                    cards.forEach((card) => {
                      if (card.title.includes(text) && card.description.includes(text)){
                        idAndTitles.push({_id: card._id, title: card.title, description: card.description})
                      } else if (card.title.includes(text)){
                        idAndTitles.push({_id: card._id, title: card.title})
                      } else {
                        idAndTitles.push({_id: card._id, description: card.description})
                      }
                    })
                    finalResult.push({cards: idAndTitles})
                    
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
})

module.exports = router