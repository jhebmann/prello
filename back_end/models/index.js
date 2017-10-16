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


const activities = mongoose.model('Activity')
const attachments = mongoose.model('Attachment')
const boards = mongoose.model('Board')
const cards = mongoose.model('Card')
const checklists = mongoose.model('Checklist')
const comments = mongoose.model('Comment')
const items = mongoose.model('Item')
const labels = mongoose.model('Label')
const lists = mongoose.model('List')
const notifications = mongoose.model('Notification')
const teams = mongoose.model('Team')
const users = mongoose.model('User')

module.exports = {activities: activities, attachments: attachments, boards: boards, cards: cards, checklists: checklists, comments: comments, items: items, labels: labels, lists: lists, notifications: notifications, teams: teams, users: users}