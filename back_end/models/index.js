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

const Lists = mongoose.model('Lists');
const Cards = mongoose.model('Cards');

module.exports = {Lists: Lists, Cards: Cards}