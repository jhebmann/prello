import React from 'react'
import SocketIOClient from 'socket.io-client'
import {Button,FormControl,Grid,Row,Col,Thumbnail} from 'react-bootstrap'
import axios from 'axios'
import url from '../../config'

class Home extends React.Component{
    
  constructor(props){
    super(props);    
    //Default State
    this.state={
      boards: [],
      titleNewBoard: null
    }
    this.socket = SocketIOClient('http://localhost:8000')
   
    //Event Listeners
    this.renderBoards = this.renderBoards.bind(this)
    this.onClickAddBoard = this.onClickAddBoard.bind(this)
    this.addBoard = this.addBoard.bind(this)
    this.deleteBoard = this.deleteBoard.bind(this)
    this.socket.on('addBoard', this.addBoard)
    this.socket.on('deleteBoard', this.deleteBoard)
    this.handleCardTitleInputChange = this.handleCardTitleInputChange.bind(this)
  }

  componentWillMount() {
    axios.get(url.api + 'board')
    .then((response) => {
      this.setState({boards:response.data})
    })
    .catch((error) => {
      alert('An error occured when getting the cards')
    })
  }
  

  render(){
    return(
        <div>
          <p style={{display: "inline-flex"}}><FormControl type="text" onChange={this.handleCardTitleInputChange} placeholder="Board Title" /></p>
          <Button bsStyle="success" className='addListButton' onClick={this.onClickAddBoard}>Add Board</Button>    
          <Grid>
            <Row>
              {this.renderBoards(this.state.boards)}
            </Row>
          </Grid>
        </div>
    )
  } 
  
  onClickAddBoard(){
    axios.post(url.api + 'board', {
      title: this.state.titleNewBoard
    }).then((response) => {
      console.log(response.data)
      this.socket.emit("newBoard", response.data)
      this.addBoard(response.data)
    })
    .catch((error) => {
      alert('An error occured when getting the cards')
    })
  }

  addBoard(board){
    this.setState(prevState=>({
        boards: prevState.boards.concat(board)
    }))
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
      alert('An error occured when getting the cards')
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
       </Thumbnail>
    </Col>
    
    );
    return boardItems
  }
}


export default Home