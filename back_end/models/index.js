require('./card')
require('./list')

const mongoose = require('mongoose')

const Lists = mongoose.model('Lists');
const Cards = mongoose.model('Cards');

module.exports = {Lists: Lists, Cards: Cards}