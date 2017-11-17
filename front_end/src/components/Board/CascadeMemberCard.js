import React from 'react'
import {Select,Avatar,Button,message} from 'antd'
import axios from 'axios'
import url from '../../config'
import '../Home/home.css'
import handleServerResponse from '../../response'

const Option = Select.Option
const success = (mssge) => {
    message.config({
        top: "10%",
        duration: 2,
      })
    message.success(mssge)
  }

class CascadeMemberCard extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            members: this.props.members,
            selected:null,
            card:this.props.card
        }
        this.socket=this.props.io
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        
    }

    render(){
        const memberOptions=this.state.members.map(member => <Option key={member._id} ><Avatar icon="user" size='small'/>{member.local.nickname}</Option>)

        return (
            <div>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select member name "
                optionFilterProp="children"
                value={this.state.selected}
                onChange={this.handleChange}
                notFoundContent="Member not found"
                allowClear={true}>
               {memberOptions} 
            </Select>
            <Button className='addTeamButton' onClick={this.onClick} disabled={this.state.selected===null}>
                       {this.props.remove?('Remove Member'):('Add Member')} 
                    </Button>
            </div>
        )
    }
  handleChange(key) {
    this.setState({selected:key})
  }

  onClick(){
    axios.put(url.api + 'card/'+this.state.card._id, {
        user:this.state.selected,remove:this.props.remove}, url.config)
    .then((response)=>{
        this.setState({selected:null})
        this.props.callback(response.data)
        this.socket.emit('updateCardServer', response.data)
        success('Card updated!')
        })
    .catch((error) => {
        handleServerResponse(error, 'An error occured when updating the Card')
    })
  }

  componentWillReceiveProps(nextProps){
    let newMembers=this.state.members
    newMembers=nextProps.members
    this.setState({members:newMembers})
  }
}

export default CascadeMemberCard