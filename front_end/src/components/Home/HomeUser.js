import Home from "./Home.js"
import SocketIOClient from 'socket.io-client'
import React from 'react'
import {Button,FormControl,Grid,Row} from 'react-bootstrap'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js';
import './home.css'

class HomeUser extends React.Component{
    
  constructor(props){
    super(props);    
    //Default State
    this.state={
      teams: [],
      textImput: null,
      publicBoards:null
    }
    this.socket = SocketIOClient('http://localhost:8000')
    this.addTeam = this.addTeam.bind(this);   
    this.onClickAddPublicBoard = this.onClickAddPublicBoard.bind(this)    
    this.onClickAddTeam = this.onClickAddTeam.bind(this)
    this.renderPublicBoards = this.renderPublicBoards.bind(this) 
    this.handleTeamInputChange = this.handleTeamInputChange.bind(this)
    this.socket.on("addTeam", this.addTeam)
    }

    componentWillMount() {
        if(Auth.isUserAuthenticated()){
          console.dir(url.api + 'user/' + Auth.getUserID() + '/teams')
            axios.get(url.api + 'user/' + Auth.getUserID() + '/teams',{
            })
            .then((response) => {
              this.setState({teams:response.data})
            })
            .catch((error) => {
              alert('An error occured when getting the teams!\nHint: check that the server is running')
            })
        }
    }

    onClickAddTeam(){
        axios.post(url.api + 'team', {
          name: this.state.textImput,
          admins:Auth.getUserID(),
          users:Auth.getUserID()
        }).then((response) => {
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
        }).then((response) => {
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
            {Auth.isUserAuthenticated() ? (<div id="teamForm" style={{display: "inline-flex"}}>
            <FormControl name="team" type="text" onChange={this.handleTeamInputChange} placeholder="Title" 
                value={this.state.textImput} onKeyPress={this.handleKeyPress}/>
                <Button bsStyle="primary" className='addTeamButton' onClick={this.onClickAddTeam}>Create Team</Button></div>):(<div></div>)}
            <Grid>
              <Row>
                {this.renderTeams(this.state.teams)}
                {this.renderPublicBoards(this.state.publicBoards)}
              </Row>
            </Grid>
          </div> 
        )
    }

    renderTeams(teams){
        const teamItems = teams.map((team, index)=>
          <div key = {index}>
            <hr />
            <h3> TEAM {team.name}</h3>
            <Home key={index} teamId={team._id} public={false} socket={this.socket}/>
          </div>
        )
        return teamItems
    }

    renderPublicBoards(publicBoards){
        return <div>
        <hr />
        <h3> Public Boards</h3>
        <Home public={true} socket={this.socket}/>
        </div>
    }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if ("team" === e.target.name) this.onClickAddTeam()
      }
    }
}

export default HomeUser
