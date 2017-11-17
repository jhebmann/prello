import React from 'react'
import {Select,Avatar,Button,message} from 'antd'
import axios from 'axios'
import url from '../../config'
import '../Home/home.css'

const Option = Select.Option
const success = (mssge) => {
    message.config({
        top: "10%",
        duration: 2,
      })
    message.success(mssge)
  }

class CascadeTeam extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            teams: this.props.teams,
            selected:null,
            boardId:this.props.boardId
        }
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        
    }

    render(){
        const teamOptions=this.state.teams.map(team => <Option key={team._id} ><Avatar icon="team" size='small'/>{team.name}</Option>)
        return (
            <div >
              <Select
                showSearch
                style={{ width: 200 }}
                value={this.state.selected}
                placeholder="Select team name "
                optionFilterProp="children"
                onChange={this.handleChange}
                notFoundContent="Team not found">
               {teamOptions} 
            </Select>
            <Button className='addTeamButton' onClick={this.onClick} disabled={this.state.selected===null}>
                       {this.props.remove?('Remove Team'):('Add Team')} 
                    </Button>
            </div>
        )
    }

    handleChange(key) {
        this.setState({selected:key})
    }

    onClick(){
        axios.put(url.api + 'team/'+this.state.selected, {
            board:this.state.boardId,remove:this.props.remove}, url.config)
        .then((response)=>{
            this.setState({selected:null})
            this.props.updateAllTeams(response.data)
            success('Board updated!')
        })
        .catch((error) => {
            alert('An error occured when updating the board'+error)
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({teams: nextProps.teams})
    }
}

export default CascadeTeam