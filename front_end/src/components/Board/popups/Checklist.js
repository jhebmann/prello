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
                <hr className="skylightHr"/>
                <div className="checklistForm">
                    <FormControl type="text" onChange={this.handleInputChange} name="checklist" value={this.state.checklist}
                                    onKeyPress={this.handleKeyPress} placeholder="Checklist"/>
                    <Button id='cardChecklist' bsStyle="primary" onClick={this.onClickAddChecklist} disabled={this.state.checklist.trim().length < 1}>Add</Button>
                </div>
            </div>
        )
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.checklist.trim().length > 0) this.onClickAddChecklist()
        }
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onClickAddChecklist() {
        axios.post(url.api + 'checklist/card/' + this.props.card.state.cardInfos._id, {
            title: this.state.checklist.trim()
        }, url.config).then((response) => {
            this.socket.emit('newChecklistServer', response.data)
            this.addChecklist(response.data)
        }).catch((error) => {
            alert('An error occured when adding the checklist')
        })
    }

    addChecklist(checklist) {
        let newCardInfos = this.state.card.state.cardInfos
        newCardInfos.checklists.push(checklist)
        const newShowChecklists = newCardInfos.checklists.map(c => { return { 
            showChecklist: false,
            itemState: c.items.map(item => false)
        }})
        
        this.state.popup.setState({
            cardInfos: newCardInfos,
            showChecklists: newShowChecklists
        })
        
        this.state.card.setState({cardInfos: newCardInfos})
        
        this.setState({
            checklist: ""
        })
    }
}

export default Checklist
