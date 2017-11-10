import Home from "./Home.js"
import SocketIOClient from 'socket.io-client'
import React from 'react'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js'
import './home.css'
import Cascade from '../Board/Cascade.js'
import {Spin, Button,Input, Icon,Grid,Row} from 'antd';

class HomeUser extends React.Component{
    
  constructor(props){
    super(props);
    //Default State
    this.state={
      teams: [],
      textImput: null,
      publicBoards:null,
      users:null,
      pageLoaded:false
    }
    this.socket = SocketIOClient(url.socket)
    this.addTeam = this.addTeam.bind(this);   
    this.onClickAddPublicBoard = this.onClickAddPublicBoard.bind(this)    
    this.onClickAddTeam = this.onClickAddTeam.bind(this)
    this.renderPublicBoards = this.renderPublicBoards.bind(this) 
    this.handleTeamInputChange = this.handleTeamInputChange.bind(this)
    this.socket.on("addTeam", this.addTeam)
    }

    componentWillMount() {
        if(Auth.isUserAuthenticated()){
          const instance= this
          axios.all([this.loadTeams(), this.loadUsers()])
          .then(axios.spread(function (res1, res2) {
            instance.setState({pageLoaded:true,teams:res1.data,users:res2.data})
          }))
        }
        else
          this.setState({pageLoaded:true})
    }

    loadTeams(){
      return axios.get(url.api + 'user/' + Auth.getUserID() + '/teams', url.config)
      .catch((error) => {
        alert('An error occured when getting the teams!\nHint: check that the server is running')
      })
    }

    loadUsers(){
     return axios.get(url.api + 'user/idnick', url.config)
      .catch((error) => {
        alert('An error occured when getting all the users!\nHint: check that the server is running'+error)
      })
    }

    onClickAddTeam(){
        axios.post(url.api + 'team', {
          name: this.state.textImput,
          admins:Auth.getUserID(),
          users:Auth.getUserID()
        }, url.config).then((response) => {
          this.socket.emit("newTeam", response.data)
          this.addTeam(response.data)
          this.setState({textImput: ""})
        })
        .catch((error) => {
          alert('An error occured when adding the board')
        })
      }

    addTeam(team){
      this.setState(prevState=>({
          teams: prevState.teams.concat(team)
      }))
    }

    onClickAddPublicBoard(){
        axios.post(url.api + 'board', {
          title: this.state.textImput,
          admins:Auth.getUserID(),
          users:Auth.getUserID(),
          isPublic:true
        }, url.config).then((response) => {
          this.socket.emit("newBoard", response.data)
          this.setState({textImput: ""})
        })
        .catch((error) => {
          alert('An error occured when adding the board')
        })
      }

    handleTeamInputChange(e) {  
      this.setState({textImput: e.target.value});
    }

    render(){
        return(
          <div id="mainPage">
            {this.state.pageLoaded ? (
              <div >
                {Auth.isUserAuthenticated() ? 
                  (<div id="teamsForm" className="teamsContainer" style={{display: "inline-flex"}}>
                <Input type="text" onChange={this.handleTeamInputChange} placeholder="Title" 
                    value={this.state.textImput} onKeyPress={this.handleKeyPress}/>
                    <Button type="primary" className='addTeamButton' onClick={this.onClickAddTeam}>Create Team</Button></div>):(<div></div>)}
              <div  className="teamsContainer">
              <Row >
                {this.renderTeams(this.state.teams)}
                {this.renderPublicBoards(this.state.publicBoards)}
              </Row>
              </div>
            </div>):(<div className="spinn"><Spin size='large' /></div>) }
            
          </div> 
        )
    }

    renderTeams(teams){
        const teamItems = teams.map((team, index)=>
          <div key = {index} className='teamContainer'>
            <h3><Icon type="team" />{team.name}</h3>
            <Cascade users={this.state.users} teamId={team._id} />
            <Home key={index} teamId={team._id} public={false} socket={this.socket}/>
          </div>
        )
        return teamItems
    }

    renderPublicBoards(publicBoards){
        return (
          <div >
            <hr />
            <h3> Public Boards</h3>
            <Home public={true} socket={this.socket}/>
          </div> 
        )
    }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if ("team" === e.target.name) this.onClickAddTeam()
      }
    }
}


export default HomeUser

/*
<Card title={board.title || 'Undefined'} className='card'>
<p>Description</p>
{(board.isPublic) ?(
  <p>Public Board</p>):(
  <p>Private Board</p>)
}
</Card>
*/
