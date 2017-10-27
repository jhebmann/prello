import React from 'react';
import List from './List.js';
import {Button} from 'react-bootstrap';
import './board.css'
import axios from 'axios'
import url from '../../config'

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

        this.socket.on('addList',this.createList)
        this.socket.on('deleteAllLists',this.deleteAllLists)
    }

    componentDidMount() {
        axios.get(url.api + 'board/' + this.props.id + '/lists')
        .then((response) => {
            this.getAllLists(response.data)
        })
        .catch((error) => {
            alert('An error occured when getting the boards !')
        })
    }


    render(){
        return(
            <div className='board'>
                {this.cardList(this.state.lists)}
                <Button bsStyle="success" className='addListButton' onClick={this.onClickAddList}>Add List</Button>
            </div>
        )
    }

    getAllLists(data){
        this.setState({lists: data})
    }

    onClickAddList(){
        axios.post(url.api + 'list', {
            boardId: this.props.id,
            title: "New List",
            pos: this.state.lists.length
        }).then((response) => {
            this.socket.emit('newList', response.data, this.props.id)
            this.createList(response.data, this.props.id)
        })
        .catch((error) => {
            alert('An error occured when adding the lists')
        })
    }
    
    onClickDeleteLists(){
        this.socket.emit("deleteLists", this.props.id)
    }

    createList(newList, idBoard){
        if (idBoard === this.props.id){
            this.setState(prevState=>({
                lists: prevState.lists.concat(newList)
            }))
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