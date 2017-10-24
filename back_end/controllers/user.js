'use strict';
const mongoose = require('mongoose')
const models = require('../models/index')

exports.getAllBoards = (client, idUser = "59ee468557fbcd13e4871af7")=> {
  console.log("getting all boards")
  //const tempId = "59ecb2139c018e0b1ad6690a"
  models.users.find(
    {_id: idUser},
    {"teams": 1, _id: 0},
    function (err, res) {
      if (err) throw err
      const teamsOfUser = res[0].teams
      models.teams.find(
        {_id: {$in: teamsOfUser}},
        (err, res) => {
          const boardsOfUser = res[0].boards
          models.boards.find(
            {_id: {$in: boardsOfUser}},
            (err, res)=>{
              if (err) throw err
              console.log(err)
              client.emit('getAllBoards',res);
            }
          )
        }
      )
    }
  )
/*
  const tempId = mongoose.Types.ObjectId()
  const tempUsername = "yolo" + Math.random()
  const tempPass = "yolo" + Math.random()
  const tempMail = "yolo@gmail.com" + Math.random()

  const tempBoards = [{"title": "yolo"}, {"title": "squalala"}]
  const idTeam = mongoose.Types.ObjectId()
  const idBoard1 = mongoose.Types.ObjectId()
  const idBoard2 = mongoose.Types.ObjectId()
  const tempBoardsIds = [idBoard1, idBoard2]

  //models.users.dropIndex({"mail": 1})

  const tempLocal = {mail: tempMail, nickname: tempUsername, password: tempPass}
  const tempUser = new models.users({_id: tempId, local: tempLocal, boards: tempBoardsIds, teams: [idTeam]})

  const tempBoard1 = new models.boards({_id: idBoard1, admins: [tempId]});
  const tempBoard2 = new models.boards({_id: idBoard2, admins: [tempId]});

  const tempTeam = new models.teams({_id: idTeam, admins: [tempId], boards: [idBoard1, idBoard2]})

  tempTeam.save(
    {},
    (err, res) => {
      tempBoard1.save(
        {}, (err, res) => {
          tempBoard2.save(
            {},
            (err, res) => {
              tempUser.save(
                {}, (err, res) => {
                  models.users.find(
                    {_id: tempId},
                    {"teams": 1, _id: 0},
                    function (err, res) {
                      if (err) throw err
                      const teamsOfUser = res[0].teams
                      models.teams.find(
                        {_id: {$in: teamsOfUser}},
                        (err, res) => {
                          const boardsOfUser = res[0].boards
                          models.boards.find(
                            {_id: {$in: boardsOfUser}},
                            (err, res)=>{
                              if (err) throw err
                              console.log(res)
                              client.emit('getAllBoards',res);
                            }
                          )
                        }
                      )
                    }
                  )
                }
              )
            }
          )
        }
      )
    }
  )
  */
}

exports.addUser = (client, username, password, mail) => {
  const newUser=new models.users({local: {mail: mail, username: username, password: password}});
  newUser.save(
    {},
    (err, insertedUser) => {
      if (err)
        console.log('Error adding User',err);
      else {
        console.log('User Added');
        client.emit('userAdded', insertedUser._id);
      }
    }
  );
}