module.exports = function(app){
    const users = require('../controllers/index')
    app.get('/user', users.findAll)
    app.get('/user/:id', users.findById)
    app.post('/user', users.add)
    app.put('/user/:id', users.update)
    app.delete('/user/:id', users.deleteOne)
    app.delete('/user', users.deleteAll)
}