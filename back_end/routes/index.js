const router = require('express').Router()
const models = require('../models')


router.use('/card', require('./api/card'))
router.use('/list', require('./api/list'))
router.use('/user', require('./api/user'))
router.use('/board', require('./api/board'))
router.use('/team', require('./api/team'))


router.get('/', function (req, res) {
  res.json({ message: 'API Initialized!'})
})

module.exports = router