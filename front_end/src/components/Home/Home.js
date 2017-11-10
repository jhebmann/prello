import React from 'react'
import {FormControl} from 'react-bootstrap'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js';
import {Card,Tag,Button,Row,Col,Input} from 'antd'
import './home.css' 

class Home extends React.Component{
    
  constructor(props){
    super(props);    
    //Default State
    this.state={
      boards: [],
      teamId: this.props.teamId,
      titleNewBoard: null
    }
    this.socket = this.props.socket
   
    //Event Listeners
    this.renderBoards = this.renderBoards.bind(this)
    this.onClickAddBoard = this.onClickAddBoard.bind(this)
    this.addBoard = this.addBoard.bind(this)
    this.deleteBoard = this.deleteBoard.bind(this)
    this.socket.on('addBoard', this.addBoard)
    this.socket.on('deleteBoard', this.deleteBoard)
    this.handleBoardTitleInputChange = this.handleBoardTitleInputChange.bind(this)
  }

  componentWillMount() {
    let route ='team/' + this.state.teamId + '/boards'
    if(this.props.public)
      route='board/public'
    axios.get(url.api + route, url.config)
    .then((response) => {
      this.setState({boards:response.data})
    })
    .catch((error) => {
      alert('An error occured when getting the boards!\nHint: check that the server is running')
    })
  }

  render(){
    return(
        <div>
            {Auth.isUserAuthenticated() ? (
              <div className='textFormContainer'>
              <Input onChange={this.handleBoardTitleInputChange}  style={{ width: 200 }}
              value={this.state.titleNewBoard} placeholder="Board Title" onKeyPress={this.handleKeyPress} />
              <Button bsStyle="success" className='addBoardButton' onClick={this.onClickAddBoard}>Add Board</Button>
              </div>
            ):(<div></div>)}
            <div style={{padding: "0.5%" }}>
              <Row gutter={16}>
              {this.renderBoards(this.state.boards)}
            </Row>
          </div>
       </div>
    )
}
  
onClickAddBoard(){
    let route='board'
    if(!this.props.public)
      route='board/team/' + this.state.teamId
    axios.post(url.api + route , {
      title: this.state.titleNewBoard,
      admins:Auth.getUserID(),
      users:Auth.getUserID(),
      isPublic:this.props.public
    }, url.config).then((response) => {
      this.socket.emit("newBoard", response.data, this.state.teamId)
      this.addBoard(response.data, this.state.teamId)
      this.setState({titleNewBoard: ""})
    })
    .catch((error) => {
      alert('An error occured when adding the board')
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if ("board" === e.target.name) this.onClickAddBoard()
    }
  }

  addBoard(board,teamId){
    if (teamId===this.state.teamId || (board.isPublic && this.props.public))
      this.setState(prevState=>({
          boards: prevState.boards.concat(board)
      }))
  }

  handleBoardTitleInputChange(e) {  
    this.setState({titleNewBoard: e.target.value});
  }

  onClickDeleteBoard(id){
    axios.delete(url.api + 'board/' + id, url.config)
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
    <Col span={5}>
        <a href={"/board/"+board._id}>
        <Card title={board.title || 'Undefined'} extra={<Button type="danger"  icon="delete" size="small" onClick={() => this.onClickDeleteBoard(board._id)}>Delete</Button>} >
          <Tag color="red">Tag</Tag>
          <p>Description</p>
          {(board.isPublic) ?(
            <p>Public Board</p>):(
            <p>Private Board</p>)
          }
        </Card>
        </a>
    </Col>
    );
    return boardItems
  }
}

export default Home

/*
<Card title={board.title || 'Undefined'} className='card'>
<p>Description</p>
{(board.isPublic) ?(
  <p>Public Board</p>):(
  <p>Private Board</p>)
}
</Card>
*/