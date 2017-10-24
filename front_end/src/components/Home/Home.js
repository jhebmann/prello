import React from 'react'
import NumberUser from './NumberUser'
import SocketIOClient from 'socket.io-client'
import {Button,FormControl} from 'react-bootstrap';

class Home extends React.Component{
    
  constructor(props){
    super(props);    
    //Default State
    this.state={
      boards: [],
      titleNewBoard: null
    }
    this.socket = SocketIOClient('http://localhost:8000');
   
    //Event Listeners
    this.renderBoards = this.renderBoards.bind(this);
    this.initialize = this.initialize.bind(this);
    this.onClickAddBoard = this.onClickAddBoard.bind(this);
    this.addBoard = this.addBoard.bind(this);
    this.socket.on('getAllBoards',this.initialize);
    this.socket.on('addEmptyBoard', this.addBoard);
    this.handleCardTitleInputChange = this.handleCardTitleInputChange.bind(this);
    
  }

  initialize(data){
      this.setState({boards:data})
  }

  render(){
    return(
        <div>
          <p style={{display: "inline-flex"}}><FormControl type="text" onChange={this.handleCardTitleInputChange} placeholder="Board Title" /></p>
          <Button bsStyle="success" className='addListButton' onClick={this.onClickAddBoard}>Add Board</Button>    
          {this.renderBoards(this.state.boards)}
        </div>
    )
  } 
  
  onClickAddBoard(){
    this.socket.emit("newBoard",this.state.titleNewBoard);
  }

  addBoard(id,t){
      this.setState(prevState=>({
        boards: prevState.boards.concat({
          id:id,
          title:t
        })
      }));
    }

  handleCardTitleInputChange(e) {  
    this.setState({titleNewBoard: e.target.value});
  }

  renderBoards(list){
    const boards=this.state.boards;
    const boardItems= boards.map((board, index)=>
      <p><Button key={index} href={"/board/" + board._id} >{board.title}</Button></p>
    );
    return boardItems
  }
}


export default Home