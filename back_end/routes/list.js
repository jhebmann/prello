module.exports = function(app){
    var lists = require('../controllers/list');
    app.get('/list', lists.findAll);
    app.get('/list/:id', lists.findById);
    app.post('/list', lists.add);
    app.put('/list/:id', lists.update);
    app.delete('/list/:id', lists.delete);
}
