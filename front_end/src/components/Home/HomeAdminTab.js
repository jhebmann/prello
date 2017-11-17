import React from 'react'
import Cascade from '../Board/Cascade.js'


class HomeAdminTab extends React.Component{

    constructor(props){
        super(props)
        this.state={
            team: this.props.team,
            users:this.props.users,
            selected:null,
            teamId:this.props.teamId
        }
        this.updateTeams = this.updateTeams.bind(this)
    
    }   
    
    render(){
            const teamMembers=this.state.users.filter(usr => this.state.team.users.includes(usr._id))
            const notTeamMembers=this.state.users.filter(usr => !this.state.team.users.includes(usr._id))
            const membersNotAdmin=teamMembers.filter(usr => this.state.team.users.filter(usr=>!this.state.team.admins.includes(usr)).includes(usr._id))
            const membersAdmin=teamMembers.filter(usr=>this.state.team.admins.includes(usr._id))
            return (
            <div>
                <Cascade users={notTeamMembers} teamId={this.state.team._id} task="Add Member" onChange={this.updateTeams}/>
                <Cascade users={teamMembers} teamId={this.state.team._id} task="Remove Member" onChange={this.updateTeams}/>
                <Cascade users={membersNotAdmin} teamId={this.state.team._id} task="Add Admin" onChange={this.updateTeams}/>
                <Cascade users={membersAdmin} teamId={this.state.team._id} task="Revoke Admin" onChange={this.updateTeams}/>
            </div>
            )
    }

    updateTeams(updatedTeam){
        this.setState({team:updatedTeam})
      }

}

export default HomeAdminTab