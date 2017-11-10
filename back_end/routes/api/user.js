const models = require('../../models')
const User = models.users
const Team = models.teams
const Comment = models.comments
const Card = models.cards
const Board = models.boards
const router = require('express').Router()
const mongoose = require('mongoose')

router.get('/', function (req, res, next) {
    // Return all the users
    User.find({}, {"local.password": 0, "ldap.password": 0}).then(function(users){
        res.status(200).send(users)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    // Return the user having the id given in parameter
    User.findById(req.params.id).then(function(user){
        res.status(200).send(user)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id/teams', function (req, res, next) {
    // Get all teams of the user having the id given in parameter
    const id = req.params.id
    User.findOne(
        {_id: id},
        (err, user) => {
            if (err) res.status(401).send(err)
            else if (user === null) res.status(401).send("Couldn't find the user of id " + id)
            else {
                Team.find(
                    {_id: {$in: user.teams}},
                    (err, teams) => {
                        if (err) res.status(401).send(err)
                        else res.status(200).send(teams)
                    }
                )
            }
        }
    )
})

router.post('/', function (req, res, next) {
    // Post a new user
    User.create({ _id: mongoose.Types.ObjectId(),
        local : {
            nickname : req.body.local.nickname,
            password : req.body.local.password,
            mail : req.body.local.mail,
            firstname : req.body.local.firstname,
            lastname : req.body.local.lastname
        },
        ldap : {
            nickname : req.body.ldap.nickname,
            password : req.body.ldap.password
        }        
    }).then(function(user) {
        res.status(200).send(user);
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

/*
router.delete('/:id', function (req, res, next) {
    // Delete the user having the id given in parameter
    const id = req.params.id

    //We first remove the user
    User.findOneAndRemove(
        {_id: id}
    ).then(function(user) {
        //Then we remove his reference from the comments he posted
        Comment.update(
            {postedBy: id},
            {$set: {postedBy: null}},
            {multi: true}
        ).then(function() {
            //Then we remove him from the cards he was working in
            Card.update(
                {users: id},
                {$pull: {users: id}},
                {multi: true}
            ).then(function() {
                const teamsIds = user.teams
                if (teamsIds.length !== 0){
                    Team.find(
                        {_id: {$in: teamsIds}}
                    ).then(function(teams) {
                        //Then we remove him from the teams where he was in
                        Team.update(
                            {_id: {$in: teamsIds}},
                            {$pull: {users: id, admins: id}},
                            {multi: true}
                        ).then(function() {
                            //Then we remove the teams where he was the only one in
                            Team.remove(
                                {users: []}
                            ).then(function() {
                                const allBoards = teams.map((team) => team.boards).reduce((a, b) => a.concat(b), [])
                                //Then we remove him from the boards where he was an admin
                                Board.update(
                                    {_id: {$in: allBoards}},
                                    {$pull: {admins: id}},
                                    {multi: true}
                                ).then(function(){
                                    res.status(200).send("Successfully deleted the user of id " + id)
                                }).catch(function(err) {
                                    res.status(401).send("Couldn't remove the user of id " + id + " from his boards")
                                })
                            }).catch(function(err) {
                                res.status(401).send("Couldn't remove the teams where only the user of id " + id + " was present")
                            })
                        }).catch(function(err) {
                            res.status(401).send("Couldn't remove the user of id " + id + " from his teams")
                        })
                    }).catch(function(err) {
                        res.status(401).send("Couldn't find the teams of the user of id " + id)
                    })
                } else res.status(200).send("Successfully deleted the user of id " + id)
            }).catch(function(err) {
                res.status(401).send("Couldn't remove the user of id " + id + " from his cards")
            })
        }).catch(function(err) {
            res.status(401).send("Couldn't update the comments of the user of id " + id)
        })
    }).catch(function(err) {
        res.status(401).send("Couldn't find the user of id " + id)
    })
})

router.delete('/:id', function (req, res, next) {
    // Delete the user having the id given in parameter
    const id = req.params.id

    //We first remove the user
    User.findOneAndRemove(
        {_id: id},
        (err, user) => {
            if (err || user === null) res.status(401).send("Couldn't find the user of id " + id)
            else{
                //Then we remove his reference from the comments he posted
                Comment.update(
                    {postedBy: id},
                    {$set: {postedBy: null}},
                    {multi: true},
                    (err) => {
                        if (err) res.status(401).send("Couldn't update the comments of the user of id " + id)
                        else{
                            //Then we remove him from the cards he was working in
                            Card.update(
                                {users: id},
                                {$pull: {users: id}},
                                {multi: true},
                                (err) => {
                                    if (err) res.status(401).send("Couldn't remove the user of id " + id + " from his cards")
                                    const teamsIds = user.teams
                                    if (teamsIds.length !== 0){
                                        Team.find(
                                            {_id: {$in: teamsIds}},
                                            (err, teams) => {
                                                if (err) res.status(401).send("Couldn't find the teams of the user of id " + id)  
                                                else {
                                                    //Then we remove him from the teams where he was in
                                                    Team.update(
                                                        {_id: {$in: teamsIds}},
                                                        {$pull: {users: id, admins: id}},
                                                        {multi: true},
                                                        (err) => {
                                                            if (err) res.status(401).send("Couldn't remove the user of id " + id + " from his teams")
                                                            else{
                                                                //Then we remove the teams where he was the only one in
                                                                Team.remove(
                                                                    {users: []},
                                                                    (err) => {
                                                                        if (err) res.status(401).send("Couldn't remove the teams where only the user of id " + id + " was present")   
                                                                        else {                                                                     
                                                                            const allBoards = teams.map((team) => team.boards).reduce((a, b) => a.concat(b), [])
                                                                            //Then we remove him from the boards where he was an admin
                                                                            Board.update(
                                                                                {_id: {$in: allBoards}},
                                                                                {$pull: {admins: id}},
                                                                                {multi: true},
                                                                                (err) => {
                                                                                    if (err) res.status(401).send("Couldn't remove the user of id " + id + " from his boards")
                                                                                    else res.status(200).send("Successfully deleted the user of id " + id)                                                            
                                                                                }
                                                                            )
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        }
                                                    )
                                                }                                          
                                            }                                        
                                        )
                                    } else res.status(200).send("Successfully deleted the user of id " + id)
                                }
                            )
                        }
                    }
                )
            }
        }
    )
})

router.delete('/', function (req, res, next) {
    // Delete all the users
    User.remove().then(function() {
        res.status(200).send("Successfully destroyed");
    }).catch(function(err) {
        res.status(401).send(err);
    });
})
*/

router.put('/:id', function (req, res, next) {
    // Update the user having the id given in parameter
    const id = req.params.id
    User.findOne(
        {
            _id : id,
        },
        (err, user) => {
            if (err) res.status(401).send(err)
            else if (user === null) res.status(401).send("Couldn't find the user of id " + id)
            else{
                if ('undefined' !== typeof req.body.local && 'undefined' !== typeof req.body.local.password) user.local.password = req.body.local.password
                user.save((err, user) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The user of id " + id + " has been successfully updated")
                        res.status(200).send(user)
                    }                
                })
            }
        }
    )
})

router.put('/:id/team/add/:teamId', function(req, res, next){
    // Add the user having the id given in parameter to a team
    const id = req.params.id
    const teamId = req.params.teamId
    
    User.findById(id)
    .then(function(user) {
        Team.findById(teamId)
        .then(function(team) {
            user.teams.addToSet(team._id)
            user.save()
            .then(function(user) {
                team.users.addToSet(user._id)
                team.save()
                .then(function() {
                    res.status(200).send(user)
                }).catch(function(err) {
                    res.status(401).send(err);
                })
            }).catch(function(err) {
                res.status(401).send(err);
            })
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.put('/:id/team/remove/:teamId', function(req, res, next){
    // Remove the user having the id given in parameter from a team
    const id = req.params.id
    const teamId = req.params.teamId
    
    User.findById(id)
    .then(function(user) {
        Team.findById(teamId)
        .then(function(team) {
            user.teams.pull(team._id)
            user.save()
            .then(function(user) {
                team.users.pull(user._id)
                team.admins.pull(user._id)
                team.save()
                .then(function() {
                    res.status(200).send(user)
                }).catch(function(err) {
                    res.status(401).send(err);
                })
            }).catch(function(err) {
                res.status(401).send(err);
            })
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})


module.exports = router