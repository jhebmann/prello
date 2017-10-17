module.exports = {
    mongodbUri : "mongodb://localhost:27017/test",
    options : {
        useMongoClient: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
    }
}