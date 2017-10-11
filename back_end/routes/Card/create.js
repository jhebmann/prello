module.exports = function(router, Transaction) {
    
    /**
    * @swagger
    * /card:
    *   post:
    *     tags:
    *       - Card
    *     description: Add a new card
    *     produces:
    *       - application/json
    *     parameters:
    *           - body: body
    *     responses:
    *       201:
    *         description: Successfully created
    */
    router.post('/card', function(req, res) {
        Card.create(req.body).then(function(card) {
            res.status(201).send(card);
        }).catch(function(err){
            res.status(401).send("Could not create card.");
        });
    });
};