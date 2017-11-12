import React from 'react'
import {Select, Avatar,Button} from 'antd'
import Auth from '../Auth/Auth.js'
import axios from 'axios'
import url from '../../config'
import 'antd/dist/antd.css'

const Option = Select.Option;

class Cascade extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            members: this.props.users,
            selected:null,
            teamId:this.props.teamId
        }
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        
    }

    render(){
        let memberOptions = this.state.members.filter(user => user._id !== Auth.getUserID()).map(member => <Option key={member._id} ><Avatar icon="user" size='small'/>{member.local.nickname}</Option>);
        return (
            <div className="textFormContainer">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select nickname "
                optionFilterProp="children"
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                notFoundContent="User not found"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
               {memberOptions} 
            </Select>
            <Button type="success" className='addTeamButton' onClick={this.onClick}>{this.props.task || "Add Member"}</Button>
            </div>
        );
    }
  handleChange(key) {
    this.setState({selected:key})
  }

  onClick(){
    switch (this.props.task) {
      case "Add Admin":
          this.addAdmin();
          break;
      case "Remove Member":
          this.removeMember();
          break;
      case "Revoke Admin":
          this.revokeAdmin();
          break;    
      default:
          this.addMember();
          break;
  }
  }
  addMember(){
    axios.put(url.api + 'user/'+this.state.selected + '/team/add/' + this.state.teamId, {}, url.config)
    .then(()=>{alert('Team member added!'); this.props.onChange()})
    .catch((error) => {
        alert('An error occured when adding the user to the team')
    })
  }

  removeMember(){
    const addr=url.api+'user/'+this.state.selected+'/team/remove/'+this.state.teamId
    axios.put(addr, {}, url.config)
    .then(()=>{alert('Team member removed!');this.props.onChange()})
    .catch((error) => {
        alert('An error occured when removing the user from the team')
    })
  }

  revokeAdmin(){
    const addr=url.api+'team/'+this.state.teamId + '/fromAdmin/' + this.state.selected
    axios.put(addr, {}, url.config)
    .then(()=>{alert('Admin revoked from the team!');this.props.onChange()})
    .catch((error) => {
        alert('An error occured when revoking admin from the team')
    })
  }

  addAdmin(){
    const addr=url.api+'team/'+this.state.teamId + '/toAdmin/' + this.state.selected
    axios.put(addr, {}, url.config)
    .then(()=>{alert('Admin added to the team!');this.props.onChange()})
    .catch((error) => {
        alert('An error occured when adding admin to the team')
    })
  }

  setUsers(users){
    this.setState({members:users.filter(member => member._id !== Auth.getUserID())})  
  }
}

export default Cascade