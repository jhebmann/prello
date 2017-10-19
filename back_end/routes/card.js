module.exports = function(app){
    const cards = require('../controllers/index')
    app.get('/card', cards.findAll)
    app.get('/card/:id', cards.findById)
    app.post('/card', cards.add)
    app.put('/card/:id', cards.update)
    app.delete('/card/:id', cards.deleteOne)
    app.delete('/card', cards.deleteAll)
}