require('./item')
require('./checklist')
require('./activity')
require('./attachment')
require('./comment')
require('./label')
require('./card')
require('./list')
require('./board')
require('./team')
require('./notification')
require('./user')


const mongoose = require('mongoose')


const Activities = mongoose.model('Activity')
const Attachments = mongoose.model('Attachment')
const Boards = mongoose.model('Board')
const Cards = mongoose.model('Card')
const Checklists = mongoose.model('Checklist')
const Comments = mongoose.model('Comment')
const Items = mongoose.model('Item')
const Labels = mongoose.model('Label')
const Lists = mongoose.model('List')
const Notifications = mongoose.model('Notification')
const Teams = mongoose.model('Team')
const Users = mongoose.model('User')

module.exports = {Lists: Lists, Cards: Cards, Users: Users}