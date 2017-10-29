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

module.exports = router