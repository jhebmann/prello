import React from 'react'
import {Select,Avatar,Button} from 'antd'
import Auth from '../Auth/Auth.js'
import axios from 'axios'
import url from '../../config'
import '../Home/home.css'

const Option = Select.Option;

class CascadeMemberCard extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            members: this.props.members.filter(usr=>usr._id!==Auth.getUserID()),
            selected:null,
            card:this.props.card
        }
        this.socket=this.props.io
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        
    }

    render(){
        const memberOptions=this.state.members.map(member => <Option key={member._id} ><Avatar icon="user" size='small'/>{member.local.nickname}</Option>);
        return (
            <div >
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select member name "
                optionFilterProp="children"
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                notFoundContent="Member not found"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
               {memberOptions} 
            </Select>
            <Button className='addTeamButton' onClick={this.onClick} disabled={this.state.selected===null}>
                       {this.props.remove?('Remove Member'):('Add Member')} 
                    </Button>
            </div>
        );
    }
  handleChange(key) {
    this.setState({selected:key})
  }

  onClick(){
    axios.put(url.api + 'card/'+this.state.card._id, {
        user:this.state.selected,remove:this.props.remove}, url.config)
    .then((response)=>{
        console.log(response.data)
        this.props.callback(response.data);
        this.socket.emit('updateCardServer', response.data)
        alert('Card updated!');
        })
    .catch((error) => {
        alert('An error occured when updating the Card'+error)
    })
  }

  
  setUsers(users){
    this.setState({members:users.filter(member => member._id !== Auth.getUserID())})  
  }
}

export default CascadeMemberCard