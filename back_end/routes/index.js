const router = require('express').Router()
const models = require('../models')


router.use('/card', require('./api/card'))
router.use('/list', require('./api/list'))
router.use('/user', require('./api/user'))
router.use('/board', require('./api/board'))
router.use('/team', require('./api/team'))
//router.use('/auth', require('./api/auth'))

router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
router.get('/', function (req, res) {
  res.status(200).send("API is working");
});

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message: ♥♥♥ APPLE ♥♥♥"
  });
});

module.exports = router