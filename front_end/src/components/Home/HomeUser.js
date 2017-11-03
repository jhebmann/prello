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
      titleNewTeam: null
    }
    this.socket = SocketIOClient('http://localhost:8000')
    this.addTeam = this.addTeam.bind(this);   
    this.onClickAddTeam = this.onClickAddTeam.bind(this) 
    this.handleTeamInputChange = this.handleTeamInputChange.bind(this)
    this.socket.on("addTeam", this.addTeam)
    }

    componentWillMount() {
        axios.get(url.api + 'user/' + Auth.getUserID() + '/teams',{
        })
        .then((response) => {
          this.setState({teams:response.data})
        })
        .catch((error) => {
          alert('An error occured when getting the teams!\nHint: check that the server is running')
        })
    }

    onClickAddTeam(){
        axios.post(url.api + 'team', {
          name: this.state.titleNewTeam,
          admins:Auth.getUserID()
        }).then((response) => {
          this.socket.emit("newTeam", response.data)
          this.addTeam(response.data)
          this.setState({titleNewTeam: ""})
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

    handleTeamInputChange(e) {  
      this.setState({titleNewTeam: e.target.value});
    }

    render(){
        return(
          <div id="mainPage">
            <div id="teamForm" style={{display: "inline-flex"}}>
              <FormControl name="team" type="text" onChange={this.handleTeamInputChange} placeholder="Team Title" 
                            value={this.state.titleNewTeam} onKeyPress={this.handleKeyPress}/>
            </div>
            <Button bsStyle="primary" className='addTeamButton' onClick={this.onClickAddTeam}>Create Team</Button>
            <Grid>
              <Row>
                {this.renderTeams(this.state.teams)}
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
            <Home key={index} teamId={team._id} socket={this.socket}/>
          </div>
        )
        return teamItems
    }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if ("team" === e.target.name) this.onClickAddTeam()
      }
    }

}

export default HomeUser
