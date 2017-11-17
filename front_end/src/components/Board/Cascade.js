import React from 'react'
import {Select, Avatar,Button,message} from 'antd'
import Auth from '../Auth/Auth.js'
import axios from 'axios'
import url from '../../config'
import 'antd/dist/antd.css'

const Option = Select.Option
const success = (mssge) => {
    message.config({
        top: "10%",
        duration: 2,
      })
    message.success(mssge)
  }

class Cascade extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            users: this.props.users,
            selected:null,
            teamId:this.props.teamId
        }
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        
    }

    render(){
        const memberOptions = this.state.users.filter(user => user._id !== Auth.getUserID()).map(member => <Option key={member._id} ><Avatar icon="user" size='small'/>{member.local.nickname}</Option>)
        return (
            <div >
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select nickname"
                optionFilterProp="children"
                onChange={this.handleChange}
                notFoundContent="User not found"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
               {memberOptions} 
            </Select>
            <Button type="success" disabled={this.state.selected===null} className='addTeamButton' onClick={this.onClick}>{this.props.task || "Add Member"}</Button>
            </div>
        )
    }
  handleChange(key) {
    this.setState({selected:key})
  }

  onClick(){
    switch (this.props.task) {
      case "Add Admin":
          this.addAdmin()
          break
      case "Add Admin Board":
          this.addAdminBoard()
          break
      case "Remove Member":
          this.removeMember()
          break
      case "Revoke Admin":
          this.revokeAdmin()
          break
      case "Revoke Admin Board":
          this.revokeAdminBoard()
          break           
      default:
          this.addMember()
          break
    }
  }

  addMember(){
    axios.put(url.api + 'user/'+this.state.selected + '/team/add/' + this.state.teamId, {}, url.config)
    .then((response)=>{
        success('Team member added!')
        this.props.onChange(response.data)
    })
    .catch((error) => {
        alert('An error occured when adding the user to the team '+error)
    })
  }

  removeMember(){
    const addr=url.api+'user/'+this.state.selected+'/team/remove/'+this.state.teamId
    axios.put(addr, {}, url.config)
    .then((response)=>{
        success('Team member removed!')
        this.props.onChange(response.data)
    })
    .catch((error) => {
        alert('An error occured when removing the user from the team '+error)
    })
  }

  revokeAdmin(){
    const addr=url.api+'team/'+this.state.teamId + '/fromAdmin/' + this.state.selected
    axios.put(addr, {}, url.config)
    .then((response)=>{
        success('Admin revoked from the team!')
        this.props.onChange(response.data)
    })
    .catch((error) => {
        alert('An error occured when revoking admin from the team')
    })
  }

  addAdmin(){
    const addr=url.api+'team/'+this.state.teamId + '/toAdmin/' + this.state.selected
    axios.put(addr, {}, url.config)
    .then((response)=>{
        success('Admin added to the team!')
        this.props.onChange(response.data)
    })
    .catch((error) => {
        alert('An error occured when adding admin to the team')
    })
  }

  addAdminBoard(){
    const addr=url.api+'board/'+this.props.boardId + '/toAdmin/' + this.state.selected
    axios.put(addr, {}, url.config)
    .then((response)=>{success('Admin added to the Board!');this.props.updateBoard(response.data)})
    .catch((error) => {
        alert('An error occured when adding admin to the Board'+error)
    })
  }

  revokeAdminBoard(){
    const addr=url.api+'board/'+this.props.boardId + '/fromAdmin/' + this.state.selected
    axios.put(addr, {}, url.config)
    .then((response)=>{success('Admin revoked from the Board!');this.props.updateBoard(response.data)})
    .catch((error) => {
        alert('An error occured when revoking admin from the Board'+error)
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({users: nextProps.users})
  }

}

export default Cascade