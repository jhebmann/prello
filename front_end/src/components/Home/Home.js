import React from 'react'
import SocketIOClient from 'socket.io-client'
import {Button,FormControl,Grid,Row,Col,Thumbnail} from 'react-bootstrap'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js';

class Home extends React.Component{
    
  constructor(props){
    super(props);    
    //Default State
    this.state={
      boards: props.boards,
      teamId:this.props.team,
      titleNewBoard: null
    }
    this.socket = SocketIOClient('http://localhost:8000')
   
    //Event Listeners
    this.renderBoards = this.renderBoards.bind(this)
    this.onClickAddPrivateBoard = this.onClickAddPrivateBoard.bind(this)
    this.onClickAddPublicBoard = this.onClickAddPublicBoard.bind(this)    
    this.addBoard = this.addBoard.bind(this)
    this.deleteBoard = this.deleteBoard.bind(this)
    this.onClickAddTeam = this.onClickAddTeam.bind(this) 
    this.socket.on('addBoard', this.addBoard)
    this.socket.on('deleteBoard', this.deleteBoard)
    this.handleCardTitleInputChange = this.handleCardTitleInputChange.bind(this)
  }

  componentWillMount() {
    this.setState()
  }

  

  render(){
    return(
        <div>
          <p style={{display: "inline-flex"}}><FormControl type="text" onChange={this.handleCardTitleInputChange} placeholder="Board Title" /></p>
          {Auth.isUserAuthenticated() ? (<Button bsStyle="success" className='addListButton' onClick={this.onClickAddPrivateBoard}>Add Board</Button>):(<div></div>)}
          <Button bsStyle="primary" className='addListButton' onClick={this.onClickAddPublicBoard}>Add Public Board</Button>
          <Button bsStyle="primary" className='addListButton' onClick={this.onClickAddTeam}>Create Team</Button>
          <Grid>
            <Row>
              {this.renderBoards(this.state.boards)}
            </Row>
          </Grid>
        </div>
    )
}
  
  
  postBoard(isPublic){
    axios.post(url.api + 'board', {
      title: this.state.titleNewBoard,
      admins:Auth.getUserID(),
      isPublic:isPublic
    }).then((response) => {
      console.log(response.data)
      this.socket.emit("newBoard", response.data,this.state.teamId)
      this.addBoard(response.data,this.state.teamId)
    })
    .catch((error) => {
      alert('An error occured when adding the board')
    })
  }

  onClickAddPublicBoard(){
    this.postBoard(true)
  }

  onClickAddPrivateBoard(){
    this.postBoard(false)
  }

  addBoard(board,teamId){
    if (teamId===this.state.teamId)
      this.setState(prevState=>({
          boards: prevState.boards.concat(board)
      }))
  }

  onClickAddTeam(){
 axios.post(url.api + 'team', {
      name: this.state.titleNewBoard,
      admins:Auth.getUserID(),
      users:Auth.getUserID()
    }).then((response) => {
      
    })
    .catch((error) => {
      alert('An error occured when adding the board')
    })
  }

  handleCardTitleInputChange(e) {  
    this.setState({titleNewBoard: e.target.value});
  }

  onClickDeleteBoard(id){
    axios.delete(url.api + 'board/' + id)
    .then((response) => {
      this.socket.emit('deleteBoard', id)
      this.deleteBoard(id)
    })
    .catch((error) => {
      alert('An error occured when deleting the board')
    })
  }

  deleteBoard(id){
    this.setState(prevState=>({
      boards: prevState.boards.filter((item) => item._id !== id)
    }));
  }

  renderBoards(list){
    const boards = this.state.boards
    const boardItems = boards.map((board, index)=>
      <Col key = {index} xs = {6} md = {4}>
      <Button bsStyle="danger" onClick={() => this.onClickDeleteBoard(board._id)}>Delete Board</Button>
      <Thumbnail style={{background:"aliceblue"}} href={"/board/" + board._id}>
        <h3>{board.title || 'Undefined'}</h3>
        <p>Description</p>
        {(board.isPublic) ?(
          <p>Public Board</p>):(
          <p>Private Board</p>)
        }</Thumbnail>
    </Col>
    
    );
    return boardItems
  }
}


export default Home