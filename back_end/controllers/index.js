const models = require('../models/index.js');

/*app.use('/activity', require('./activity'))
app.use('/attachment', require('./attachment'))
app.use('/board', require('./board'))
app.use('/card', require('./card'))
app.use('/checklist', require('./checklist'))
app.use('/comment', require('./comment'))
app.use('/item', require('./item'))
app.use('/label', require('./label'))
app.use('/list', require('./list'))
app.use('/notification', require('./notification'))
app.use('/team', require('./team'))
app.use('/user', require('./user'))*/

const activities = require('./activity')
const attachments = require('./attachment')
const boards = require('./board')
const cards = require('./card')
const checklists = require('./checklist')
const comments = require('./comment')
const items = require('./item')
const labels = require('./label')
const lists = require('./list')
const notifications = require('./notification')
const teams = require('./team')
const users = require('./user')
module.exports = {activities: activities, attachments: attachments, boards: boards, cards: cards, checklists: checklists, comments: comments, items: items, labels: labels, lists: lists, notifications: notifications, teams: teams, users: users}

/*
router.use('/', require('./list'))
router.use('/', require('./card'))
*/

//module.exports = router