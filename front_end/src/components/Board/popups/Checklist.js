import React from 'react'
import { Button, FormControl } from 'react-bootstrap'


class Checklist extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            checklists: this.props.checklists
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    render(){
        
        return(
            <div className="checklist">
                <hr/>
                <span className="titlePopups">Title</span>
                <FormControl type="text" onChange={this.handleInputChange} placeholder="Add checklist" name="checklist" 
                                onKeyPress={this.handleKeyPress} value="Checklist"/>
                <Button id='cardChecklist' bsStyle="success" onClick={this.addChecklist}>Add</Button>
            </div>
        )
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

}

export default Checklist
