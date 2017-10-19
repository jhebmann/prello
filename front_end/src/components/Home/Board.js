import React from 'react';
import List from './List.js';
import {Button} from 'react-bootstrap';

class Board extends React.Component{
    
    constructor(props){
        super(props);    
        //Default State
        this.state={
          lists: [],
          titleNewList: null
        }

        this.socket = this.props.io;
        this.initialize = this.initialize.bind(this);
        this.onClickAddList = this.onClickAddList.bind(this);
        this.createList = this.createList.bind(this);
        this.deleteAllLists = this.deleteAllLists.bind(this);

        this.socket.on('initialize', this.initialize);  //We should use componentDidMount() ?
        this.socket.on('addEmptyList',this.createList);
        this.socket.on('deleteAllLists',this.deleteAllLists);
    }

    render(){
        return(
            <div>
                <Button bsStyle="success" onClick={this.onClickAddList}>Add List</Button>
                {this.cardList(this.state.lists)}
            </div>
          );
      }

      initialize(data){
          this.setState({lists:data});
      }

      onClickAddList(){
          this.socket.emit("newList");
      }

      createList(id){
        const newList={
            _id: id,
            cards: [],
            titleNewCard: null
           }
        this.setState(prevState=>({
            lists: prevState.lists.concat(newList)
        }));
      }

      cardList(lists){
        const listItems= lists.map((list, index)=>
          <List key={index} cards={list.cards} id={list._id} io={this.socket} titleList={list.titleList}/>
        );
        return listItems
      }

      deleteAllLists(){
          this.setState({lists: []})
      }
}
export default Board;