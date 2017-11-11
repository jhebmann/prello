import Home from "./Home.js"
import SocketIOClient from 'socket.io-client'
import React from 'react'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js'
import './home.css'
import Cascade from '../Board/Cascade.js'
import {Spin, Button, Input, Icon, Row,Collapse,Tabs,Avatar,Tooltip} from 'antd';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

class HomeUser extends React.Component{
    
  constructor(props){
    super(props);
    //Default State
    this.state={
      teams: [],
      textImput: null,
      publicBoards:null,
      users:null,
      pageLoaded:false,
      key:null
    }
    this.socket = SocketIOClient(url.socket)
    this.addTeam = this.addTeam.bind(this);   
    this.onClickAddPublicBoard = this.onClickAddPublicBoard.bind(this)    
    this.onClickAddTeam = this.onClickAddTeam.bind(this)
    this.renderPublicBoards = this.renderPublicBoards.bind(this) 
    this.handleTeamInputChange = this.handleTeamInputChange.bind(this)
    this.updateTeams = this.updateTeams.bind(this) 
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
     return axios.get(url.api + 'user/', url.config)
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
                  (<div id="teamsForm" className="teamInput">
                <Input type="text" onChange={this.handleTeamInputChange} placeholder="Add a team.." 
                    value={this.state.textImput} onKeyPress={this.handleKeyPress}/>
                <Button type="primary" className='addTeamButton' onClick={this.onClickAddTeam}>Create Team</Button></div>):(<div></div>)}
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
           <Collapse bordered={true} >
            <Panel header={<h3><Icon type="team" />{team.name}</h3>} key={index}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<span><Icon type="solution" />Boards</span>} key="1">
                  <Home key={index} teamId={team._id} public={false} socket={this.socket}/>
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

    renderAdminTab(team){
      if(team.admins.includes(Auth.getUserID())){
        const teamMembers=this.state.users.filter(usr => team.users.includes(usr._id));
        const notTeamMembers=this.state.users.filter(usr => !team.users.includes(usr._id))
        const membersNotAdmin=teamMembers.filter(usr => team.users.filter(usr=>!team.admins.includes(usr)).includes(usr._id))
        const membersAdmin=teamMembers.filter(usr=>team.admins.includes(usr._id))
        return (
            <TabPane tab={<span><Icon type="tool" />Team Options</span>} key="3">
              <Cascade users={notTeamMembers} teamId={team._id} task="Add Member" onChange={this.updateTeams}/>
              <Cascade users={teamMembers} teamId={team._id} task="Remove Member" onChange={this.updateTeams}/>
              <Cascade users={membersNotAdmin} teamId={team._id} task="Add Admin" onChange={this.updateTeams}/>
              <Cascade users={membersAdmin} teamId={team._id} task="Revoke Admin" onChange={this.updateTeams}/>
            </TabPane>
          )
        }
    }

    renderTeamMembersTab(team){
      const teamMembers=this.state.users.filter(usr => team.users.includes(usr._id))
      const teamMemberItems = teamMembers.map((member, index)=>
        <div className="teamMember">
           <Tooltip title={member.local.mail} >
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

    updateTeams(){
      axios.get(url.api + 'user/' + Auth.getUserID() + '/teams', url.config)
      .then((response) => {
        this.setState({teams:response.data})
      })
      .catch((error) => {
          alert('An error occured when getting the teams!'+error)
      })
    }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if ("team" === e.target.name) this.onClickAddTeam()
      }
    }
}


export default HomeUser