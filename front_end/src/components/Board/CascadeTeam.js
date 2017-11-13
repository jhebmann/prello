import React from 'react'
import {Select,Avatar} from 'antd'
import {Button} from 'react-bootstrap';
import Auth from '../Auth/Auth.js'
import axios from 'axios'
import url from '../../config'
import '../Home/home.css'

const Option = Select.Option;

class CascadeTeam extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            teams: this.props.teams,
            selected:null,
            boardId:this.props.boardId
        }
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        
    }

    render(){
        const teamOptions=this.state.teams.map(team => <Option key={team._id} ><Avatar icon="team" size='small'/>{team.name}</Option>);
        return (
            <div >
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select team name "
                optionFilterProp="children"
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                notFoundContent="Team not found"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
               {teamOptions} 
            </Select>
            <Button bsStyle="success" id='addListButton' onClick={this.onClick} disabled={this.state.selected===null}>
                       {this.props.remove?('Remove Team'):('Add Team')} 
                    </Button>
            </div>
        );
    }
  handleChange(key) {
    this.setState({selected:key})
  }

  onClick(){
    axios.put(url.api + 'team/'+this.state.selected, {
        board:this.state.boardId,remove:this.props.remove}, url.config)
    .then(()=>{alert('Board updated!')})
    .catch((error) => {
        alert('An error occured when updating the board')
    })
  }

  setUsers(users){
    this.setState({members:users.filter(member => member._id !== Auth.getUserID())})  
  }
}

export default CascadeTeam