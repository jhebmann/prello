const models = require('../../models')
const Team = models.teams
const Board = models.boards
const User = models.users
const router = require('express').Router()

// Done

router.get('/', function (req, res, next) {
    // Get all the teams
    Team.find().then(function(teams){
        res.status(200).send(teams)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id', function (req, res, next) {
    // Get the team having the id given in parameter
    Team.findById(req.params.id).then(function(team){
        res.status(200).send(team)
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id/boards', function (req, res, next) {
    // Get all boards of the team having the id given in parameter
    Team.findOne(
        {_id: req.params.id},
        (err, team) => {
            if (err) res.status(401).send(err)
            else if (team === null) res.status(401).send("Couldn't find the team of id " + id)
            else {
                Board.find(
                    {_id: {$in: team.boards}},
                    (err, boards) => {
                        if (err) res.status(401).send(err)
                        else res.status(200).send(boards)
                    }
                )
            }
        }
    )
})

router.get('/:id/users', function (req, res, next) {
    // Get all members of the team having the id given in parameter
    Team.findById(req.params.id)
    .then(function(team) {
        User.find(
            {_id: {$in: team.users}},
            {"local.password": 0, "ldap.password": 0}
        )
        .then(function(users) {
            res.status(200).send(users)
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id/admins', function (req, res, next) {
    // Get all admins of the team having the id given in parameter
    Team.findById(req.params.id)
    .then(function(team) {
        User.find(
            {_id: {$in: team.admins}},
            {"local.password": 0, "ldap.password": 0}
        )
        .then(function(users) {
            res.status(200).send(users)
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.get('/:id/simpleUsers', function (req, res, next) {
    // Get all members of the team having the id given in parameter
    Team.findById(req.params.id)
    .then(function(team) {
        User.find(
            {_id: {$in: team.users, $nin: team.admins}},
            {"local.password": 0, "ldap.password": 0}
        )
        .then(function(users) {
            res.status(200).send(users)
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err);
    })
})

router.post('/', function (req, res, next) {
    // Post a new team
    Team.create(
        { 
            name: req.body.name,
            description: req.body.description,
            users: ('undefined' !== typeof req.body.users) ? req.body.users : [],
            admins: req.body.admins
        },
        (err, team) => {
            if (err) res.status(401).send(err)
            else{
                User.findOneAndUpdate(
                    {_id: team.admins[0]},
                    {$push: {teams: team._id}},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else res.status(200).send(team)
                    }
                )
            }
        }
    )
})

router.delete('/:id', function (req, res, next) {
    // Delete the team having the id given in parameter
    const id = req.params.id
    Team.findOneAndRemove(
        {_id: id},
        (err, res) => {
            if (err) res.status(401).send(err)
            else{
                User.update(
                    {"teams._id": id},
                    {$pull: {teams: id}},
                    {multi: true},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else{
                            Board.update(
                                {"teams._id": id},
                                {$pull: {teams: id}},
                                {multi: true},
                                (err) => {
                                    if (err) res.status(401).send(err)
                                    else res.status(200).send("Successfully destroyed the team of id " + id)
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
    // Delete all the teams
    Team.remove(
        {},
        (err) => {
            if (err) res.status(401).send(err)
            else{
                User.update(
                    {},
                    {teams: []},
                    {multi: true},
                    (err) => {
                        if (err) res.status(401).send(err)
                        else{
                            Board.update(
                                {},
                                {teams: []},
                                {multi: true},
                                (err) => {
                                    if (err) res.status(401).send(err)
                                    else res.status(200).send("Successfully destroyed all the teams")
                                }
                            )
                        }
                    }
                )
            }
        }
    )
})


router.put('/:id', function (req, res, next) {
    // Update the team with the id given in parameter
    const id = req.params.id

    Team.findOne(
        {_id : id,},
        (err, team) => {
            if (err) res.status(401).send(err)
            else if (team === null) res.status(401).send("Couldn't find the team of id " + id)
            else {
                if ('undefined' !== typeof req.body.name) team.name = req.body.name
                if ('undefined' !== typeof req.body.description) team.description = req.body.description
                team.save((err, team) => {
                    if (err) res.status(401).send(err)
                    else {
                        console.log("The team of id " + id + " has been successfully updated")
                        res.status(200).send(team)
                    }                
                })
            }
        }
    )
})

router.put('/:id/toAdmin/:userId', function (req, res, next) {
    // Update the team with the id given in parameter to set the specified user as admin
    const id = req.params.id
    const userId = req.params.userId

    Team.findOne(
        {_id: id, users: userId}
    )
    .then(function(team) {
        team.admins.addToSet(userId)
        team.save()
        .then(function(team) {
            res.status(200).send(team)
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err)
    })
})

router.put('/:id/fromAdmin/:userId', function (req, res, next) {
    // Update the team with the id given in parameter to remove the specified user from the admins
    const id = req.params.id
    const userId = req.params.userId

    Team.findOne(
        {_id: id, admins: userId}
    )
    .then(function(team) {
        team.admins.pull(userId)
        team.save()
        .then(function(team) {
            res.status(200).send(team)
        }).catch(function(err) {
            res.status(401).send(err);
        })
    }).catch(function(err) {
        res.status(401).send(err)
    })
})


module.exports = router