import React from 'react'
import { Button, FormControl } from 'react-bootstrap'


class Checklist extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            checklists: this.props.checklists,
            checklist: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.addChecklist = this.addChecklist.bind(this)
    }

    render(){
        
        return(
            <div className="checklist">
                <hr/>
                <span className="titlePopups">Title</span>
                <FormControl type="text" onChange={this.handleInputChange} placeholder="Add checklist" name="checklist" 
                                onKeyPress={this.handleKeyPress} placeholder="Checklist"/>
                <Button id='cardChecklist' bsStyle="success" onClick={this.addChecklist} disabled={this.state.checklist.length < 1}>Add</Button>
            </div>
        )
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    addChecklist(e) {
        alert(this.state.checklist)
    }

}

export default Checklist
