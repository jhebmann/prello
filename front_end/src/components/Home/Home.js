import React from 'react'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js'
import {Button, Col, Input, Row} from 'antd'
import HomeUserBoard from './HomeUserBoard.js'
import 'react-confirm-alert/src/react-confirm-alert.css'
import './home.css'
import handleServerResponse from '../../response'

class Home extends React.Component{

  constructor(props){
    super(props)
    //Default State
    this.state={
      boards: [],
      teamId: this.props.teamId,
      titleNewBoard: null,
      allTeams:this.props.allTeams
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
      handleServerResponse(error, 'An error occured when getting the boards!')
    })
  }

  render(){
    return(
        <div>
            {Auth.isUserAuthenticated() &&
              <div className='textFormContainer'>
                <Input onChange={this.handleBoardTitleInputChange}  style={{ width: 200 }} name="addBoard"
                value={this.state.titleNewBoard} placeholder="Board Title" onKeyPress={this.handleKeyPress} />
                <Button type="success" className="addTeamButton" onClick={this.onClickAddBoard}
                        disabled={!this.state.titleNewBoard || this.state.titleNewBoard.trim().length < 1}
                >
                  Add Board
                </Button>
              </div>
            }
            <div id="homeDiv">
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
      title: this.state.titleNewBoard.trim(),
      admins:Auth.getUserID(),
      users:Auth.getUserID(),
      isPublic:this.props.public
    }, url.config).then((response) => {
      this.socket.emit("newBoard", response.data, this.state.teamId)
      this.addBoard(response.data, this.state.teamId)
      this.setState({titleNewBoard: ""})
    })
    .catch((error) => {
      handleServerResponse(error, 'An error occured when adding the board')
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if ("addBoard" === e.target.name) {
        if (e.target.value.trim().length > 0) {
          this.onClickAddBoard()
        }
      }
    }
  }

  addBoard(board,teamId){
    if (teamId===this.state.teamId || (board.isPublic && this.props.public))
      this.setState(prevState=>({
          boards: prevState.boards.concat(board)
      }))
  }

  handleBoardTitleInputChange(e) {
    this.setState({titleNewBoard: e.target.value})
  }




  deleteBoard(id){
    this.setState(prevState=>({
      boards: prevState.boards.filter((item) => item._id !== id)
    }))
  }

  renderBoards(list){
    const boards = this.state.boards
    const boardItems = boards.map((board)=>
    <Col span={5} key={board._id} className="boardPreview">
        <div className="clickable" onClick={() => window.location = "/board/"+board._id}>
          <HomeUserBoard board={board} deleteBoard={this.deleteBoard} socket={this.props.socket}/>
        </div>
    </Col>
    )
    return boardItems
  }
}

export default Home