module.exports = function(app){
    var cards = require('../controllers/card');
    app.get('/card', cards.findAll);
    app.get('/card/:id', cards.findById);
    app.post('/card', cards.add);
    app.put('/card/:id', cards.update);
    app.delete('/card/:id', cards.delete);
}
