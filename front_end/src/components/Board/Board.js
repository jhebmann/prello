import React from 'react';
import List from './List.js';
import {Button} from 'react-bootstrap';
import './board.css'

class Board extends React.Component{
    
    constructor(props){
        super(props)
        
        this.state={
            lists: []
        }

        this.socket = this.props.io;
        this.getAllLists = this.getAllLists.bind(this);
        this.onClickAddList = this.onClickAddList.bind(this);
        this.onClickDeleteLists = this.onClickDeleteLists.bind(this);
        this.createList = this.createList.bind(this);
        this.deleteAllLists = this.deleteAllLists.bind(this);

        this.socket.emit("getLists", this.props.id)

        this.socket.on('getAllLists', this.getAllLists);  //We should use componentDidMount() ?
        this.socket.on('addEmptyList',this.createList);
        this.socket.on('deleteAllLists',this.deleteAllLists);
    }


    render(){
        return(
            <div className='board'>
                {this.cardList(this.state.lists)}
                <Button bsStyle="success" className='addListButton' onClick={this.onClickAddList}>Add List</Button>
            </div>
        );
    }

    getAllLists(data){
        this.setState({lists: data[0].lists});
    }

    onClickAddList(){
        this.socket.emit("newList", this.props.id, this.state.lists.length);
    }
    
    onClickDeleteLists(){
        this.socket.emit("deleteLists", this.props.id)
    }

    createList(idList, idBoard){
        if (idBoard === this.props.id){
            const newList={
                _id: idList,
                cards: [],
                titleNewCard: null
            }
            this.setState(prevState=>({
                lists: prevState.lists.concat(newList)
            }));
        }
    }

    cardList(lists){
        const listItems= lists.map((list, index)=>
        <List key={index} cards={list.cards} id={list._id} io={this.socket} title={list.title} idBoard={this.props.id}/>
        )
        return listItems
    }

    deleteAllLists(){
        this.setState({lists: []})
    }
}
export default Board;