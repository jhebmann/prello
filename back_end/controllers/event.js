const models = require('../models/index.js');

exports.get_all_cards = (client, db)=> {
    db.find({}, (err, doc)=>{//Get lists and emit event to the new user connected
        client.emit('initialize',doc); 
    });
}

exports.save_new_card=(client,db,card,id_list)=>{
    client.broadcast.emit('newCard', card, id_list);
    db.findOneAndUpdate({id_list:id_list},
        { "$push": { "cards": card } },
        { "new": true, "upsert": true },
        function (err, managerparent) {
            if (err) throw err;
        }
    );
}

exports.delete_list=(client,db,id_list)=>{
    db.findOneAndUpdate({id_list:id_list},
    { "cards": [] } ,
    { "new": true, "upsert": true },
    function (err, managerparent) {
        if (err) throw err;
    }
    );
    client.broadcast.emit('changeList',[],id_list);
}

exports.create_list=(client,id_list)=>{
    const newList=new models.Lists();
    newList.id_list=id_list;
    newList.save({}, (err)=> { //For now delete all the cards from database
    if (err)
        console.log('Error adding List',err);
    console.log('List Added');
    });
    client.broadcast.emit('addEmptyList',id_list);
}