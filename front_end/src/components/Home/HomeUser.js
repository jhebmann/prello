import Home from "./Home.js"
import SocketIOClient from 'socket.io-client'
import React from 'react'
import axios from 'axios'
import {Spin, Button, Input, Icon, Row, Collapse, Tabs, Avatar, Tooltip} from 'antd'
import { confirmAlert } from 'react-confirm-alert'
import './home.css'
import HomeAdminTab from './HomeAdminTab.js'
import url from '../../config'
import Auth from '../Auth/Auth.js'
import handleServerResponse from '../../response'

const Panel = Collapse.Panel
const TabPane = Tabs.TabPane

class HomeUser extends React.Component{
    
  constructor(props){
    super(props)
    //Default State
    this.state={
      teams: [],
      allTeams:[],
      textInput: null,
      publicBoards:null,
      users:null,
      pageLoaded:false,
      key:null,
      parameters: this.props.location.state
    }

    this.socket = SocketIOClient(url.socket)
    this.addTeam = this.addTeam.bind(this)
    this.deleteTeam = this.deleteTeam.bind(this)
    this.onClickAddPublicBoard = this.onClickAddPublicBoard.bind(this)
    this.onClickAddTeam = this.onClickAddTeam.bind(this)
    this.onClickDeleteTeam = this.onClickDeleteTeam.bind(this)
    this.renderPublicBoards = this.renderPublicBoards.bind(this)
    this.handleTeamInputChange = this.handleTeamInputChange.bind(this)
    this.userTeams = this.userTeams.bind(this)
    
    this.socket.on("addTeam", this.addTeam)
    this.socket.on("deleteTeamServer", this.deleteTeam)
    }

    componentWillMount() {
        if(Auth.isUserAuthenticated()){
          if (url.config.headers.authorization === "Bearer: null"){
            window.location = "/"
          }
          else {
            axios.all([this.loadTeams(), this.loadUsers()])
            .then(axios.spread((res1, res2) => {
              this.setState({
                pageLoaded:true,
                teams:this.userTeams(res1.data),
                allTeams:res1.data,users:res2.data
              })
            }))
          }
        }
        else
          window.location = "/login"
    }

    loadTeams(){
      return axios.get(url.api + 'team', url.config)
      .catch((error) => {
        handleServerResponse(error, 'An error occured when getting the teams!')
      })
    }

    userTeams(teams){
      return teams.filter(team=>team.users.includes(Auth.getUserID())).sort((a, b) => a.name > b.name)
    }

    loadUsers(){
     return axios.get(url.api + 'user/', url.config)
      .catch((error) => {
        handleServerResponse(error, 'An error occured when getting all the users')
      })
    }

    onClickAddTeam(){
      axios.post(url.api + 'team', {
        name: this.state.textInput.trim(),
        admins:Auth.getUserID(),
        users:Auth.getUserID()
      }, url.config).then((response) => {
        this.socket.emit("newTeam", response.data)
        this.addTeam(response.data)
        this.setState({textInput: ""})
      })
      .catch((error) => {
        handleServerResponse(error, 'An error occured when adding the board')
      })
    }

    onClickDeleteTeam(team) {
      confirmAlert({
        title: 'Delete the team ' + team.name + '?',
        message: 'This team will be removed and you won\'t be able to recover it. There is no undo !',
        confirmLabel: 'Delete',                           // Text button confirm
        cancelLabel: 'Cancel',                             // Text button cancel
        onConfirm: () => (
          axios.delete(`${url.api}team/${team._id}`, url.config)
          .then((response) => {
            this.socket.emit("deleteTeamServer", team._id)
            this.deleteTeam(team._id)
          })
          .catch((error) => {
            handleServerResponse(error, 'An error occured when deleting the team')
          })
        )
      })
    }

    addTeam(team){
      this.setState(prevState=>({
          teams: prevState.teams.concat(team)
      }))
    }

    deleteTeam(teamId) {
      let newTeams = this.state.teams
      newTeams = newTeams.filter(x => x._id !== teamId)
      this.setState({teams: newTeams})
    }

    onClickAddPublicBoard(){
        axios.post(url.api + 'board', {
          title: this.state.textInput.trim(),
          admins:Auth.getUserID(),
          users:Auth.getUserID(),
          isPublic:true
        }, url.config).then((response) => {
          this.socket.emit("newBoard", response.data)
          this.setState({textInput: ""})
        })
        .catch((error) => {
          handleServerResponse(error, 'An error occured when adding the board')
        })
      }

    handleTeamInputChange(e) {  
      this.setState({textInput: e.target.value})
    }

    render(){
        return(
          <div id="mainPage">
            {this.state.pageLoaded ? (
              <div> 
                <div id="teamsForm" className="teamInput">
                  <Input type="text" onChange={this.handleTeamInputChange} placeholder="Add a team.." name="team"
                      value={this.state.textInput} onKeyPress={this.handleKeyPress}/>
                  <Button type="primary" className='addTeamButton' onClick={this.onClickAddTeam} disabled={!this.state.textInput || this.state.textInput.trim().length < 1}>
                    Create Team
                  </Button>
                </div>
                <div  className="teamsContainer">
                  <Row >
                    {this.renderTeams(this.state.teams)}
                    {this.renderPublicBoards(this.state.publicBoards)}
                  </Row>
                </div>
              </div>):
            (<div className="spinn"><Spin size='large' /></div>) }
          </div> 
        )
    }

    renderTeams(teams){
      const teamItems = teams.map((team, index)=>
        <div key = {index} className='teamContainer'>
          <Collapse defaultActiveKey={('undefined' !== typeof this.state.parameters && team._id === this.state.parameters) ? [''+index] : []}
          className={('undefined' !== typeof this.state.parameters && team._id === this.state.parameters) ? "selected" : ""}>
          <Panel key={index}
          header=
            {
              <h3>
                <Icon type="team"/>
                {team.name}
                {(team.admins.includes(Auth.getUserID())) && <span onClick={() => this.onClickDeleteTeam(team)} className="removeTeamSpan"><Icon type="close"/></span>}
              </h3>
            }
          >
            
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon type="solution" />Boards</span>} key="1">
                <Home key={index} teamId={team._id} public={false} socket={this.socket} allTeams={this.state.allTeams}/>
              </TabPane>
                {this.renderTeamMembersTab(team)}
                {this.renderAdminTab(team)}
            </Tabs>
          </Panel>
          </Collapse>
        </div>
      )
      return teamItems
    }

    renderPublicBoards(publicBoards){
        return (
          <div className='teamContainer' >
            <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header={<h3><Icon type="team" />Public Boards</h3>} key="1"> 
            <Home public={true} socket={this.socket}/>
            </Panel>
            </Collapse>
          </div> 
        )
    }

    renderTeamMembersTab(team){
      const teamMembers=this.state.users.filter(usr => team.users.includes(usr._id))
      const teamMemberItems = teamMembers.map((member, index)=>
        <div className="teamMember" key={index}>
           <Tooltip title={member.local.nickname}>
              <Avatar size="medium" >{member.local.nickname[0]}</Avatar>
           </Tooltip>
           {member.local.nickname} 
        </div>
        )
      return(
        <TabPane tab={<span><Icon type="contacts" />Team Members</span>} key="2">
          <div className="teamMembers">
            {teamMemberItems}
          </div>
        </TabPane>
      )
    }

    renderAdminTab(team){
      if(team.admins.includes(Auth.getUserID()))
        return (
          <TabPane tab={<span><Icon type="tool" />Team Options</span>} key="3">  
            <HomeAdminTab home={this} team={team} users={this.state.users} />
          </TabPane>
          )
      return
      }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if ("team" === e.target.name) {
          if (this.state.textInput && this.state.textInput.trim().length > 0) {
            this.onClickAddTeam()
          }
        }
      }
    }
}

export default HomeUser