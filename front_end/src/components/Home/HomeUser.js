import Home from "./Home.js"
import SocketIOClient from 'socket.io-client'
import React from 'react'
import {Button,FormControl,Grid,Row} from 'react-bootstrap'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js';

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
    this.handleCardTitleInputChange = this.handleCardTitleInputChange.bind(this)
    this.socket.on("addTeam", this.addTeam)
    }

    componentWillMount() {
        axios.get(url.api + 'user/all/teams',{
          params: {
            id: Auth.getUserID()
          }
        })
        .then((response) => {
          this.setState({teams:response.data})
          console.log(response.data)
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
          console.log(response.data)
          this.socket.emit("newTeam", response.data)
          this.addTeam(response.data)
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

    handleCardTitleInputChange(e) {  
    this.setState({titleNewTeam: e.target.value});
    }

    render(){
        return(<div>
            <p style={{display: "inline-flex"}}><FormControl type="text" onChange={this.handleCardTitleInputChange} placeholder="Team Title" /></p>
            <Button bsStyle="primary" className='addListButton' onClick={this.onClickAddTeam}>Create Team</Button>
            <Grid>
              <Row>
                {this.renderTeams(this.state.teams)}
              </Row>
            </Grid>
          </div> 
        )
    }

    renderTeams(list){
        const teams = this.state.teams
        const teamItems = teams.map((team, index)=>
          <div key = {index}>
          <hr />
          <h3> TEAM {team.name}</h3>
          <Home key={index} boards={team.boards} teamId={team._id} socket={this.socket}/>
         </div>
        );
        return teamItems
      }
}

export default HomeUser
