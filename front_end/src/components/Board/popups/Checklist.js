import React from 'react'
import { Button, FormControl } from 'react-bootstrap'
import axios from 'axios'
import url from '../../../config'


class Checklist extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            checklist: ""
        }
        this.socket = this.props.io
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onClickAddChecklist = this.onClickAddChecklist.bind(this)
    }

    render(){
        
        return(
            <div className="checklistDiv">
                <hr/>
                <span className="titlePopups">Title</span>
                <FormControl type="text" onChange={this.handleInputChange} name="checklist" 
                                onKeyPress={this.handleKeyPress} placeholder="Checklist"/>
                <Button id='cardChecklist' bsStyle="success" onClick={this.onClickAddChecklist} disabled={this.state.checklist.length < 1}>Add</Button>
            </div>
        )
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ("checklist" === e.target.name) this.onClickAddChecklist()
        }
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onClickAddChecklist() {
        axios.post(url.api + 'checklist/card/' + this.props.card.state.cardInfos._id, {
            title: this.state.checklist
        }).then((response) => {
            this.socket.emit('newChecklistServer', response.data)
            this.addChecklist(response.data)
        }).catch((error) => {
            alert('An error occured when adding the checklist')
        })
    }

    addChecklist(checklist) {
        let newCardInfos = this.state.card.state.cardInfos
        newCardInfos.checklists.push(checklist)
        this.state.card.setState({cardInfos: newCardInfos})
        this.state.popup.setState({cardInfos: newCardInfos})
        this.setState({checklists: newCardInfos.checklists})
    }
}

export default Checklist
