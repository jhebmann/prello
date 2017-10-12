import React from 'react';
import List from './List.js';
import {Button} from 'react-bootstrap';

class Board extends React.Component{
    
    constructor(props){
        super(props);    
        //Default State
        this.state={
          lists: [],
          title_new_list: null
        }

        this.socket = this.props.io;
        this.initialize = this.initialize.bind(this);
        this.onClickAddList = this.onClickAddList.bind(this);
        this.createList = this.createList.bind(this);

        this.socket.on('initialize', this.initialize);  //We should use componentDidMount() ?
        this.socket.on('addEmptyList',this.createList);
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
          const id_list=Date.now()
          this.socket.emit("newList",id_list);
          this.createList(id_list);
      }

      createList(id_list){
        const new_list={id_list:id_list,
            cards: [],
           title_new_card: null
           }
        this.setState(prevState=>({
        lists: prevState.lists.concat(new_list)
        }));
      }

      cardList(lists){
        const listItems= lists.map((list, index)=>
          <List key={index} cards={list.cards} id_list={list.id_list} io={this.socket} title_list={list.title_list}/>
        );
        //console.log('List Items ',listItems);
        return listItems
      }
}
export default Board;