module.exports = function(app){
    const lists = require('../controllers/index')
    app.get('/list', lists.findAll)
    app.get('/list/:id', lists.findById)
    app.post('/list', lists.add)
    app.put('/list/:id', lists.update)
    app.delete('/list/:id', lists.deleteOne)
    app.delete('/list', lists.deleteAll)
}