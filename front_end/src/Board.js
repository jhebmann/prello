import React from 'react';
import List from './List.js';
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
        this.socket.on('initialize', this.initialize);  //We should use componentDidMount() ?
    }

    render(){
        return(
            <div>
                {this.cardList(this.state.lists)}
            </div>
          );
      }

      initialize(data){
          this.setState({lists:data});
      }

      cardList(lists){
        const listItems= lists.map((list)=>
          <List cards={list.cards} id_list={list.id_list} io={this.socket} />
        );
        console.log('List Items ',listItems);
        return listItems
      }
}
export default Board;