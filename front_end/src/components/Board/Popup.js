import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import SkyLight from 'react-skylight'
import Attachment from './popups/Attachment'
import Checklist from './popups/Checklist'
import DueDate from './popups/DueDate'
import Label from './popups/Label'
import Member from './popups/Member'
import MoveCard from './popups/MoveCard'
import axios from 'axios'
import url from '../../config'

class Popup extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            listTitle: this.props.listTitle,
            title: this.props.title,
            members: this.props.members,
            labels: this.props.labels,
            dueDate: this.props.date,
            doneDate: undefined,
            isArchived: false,
            description: this.props.description,
            checklists: this.props.checklists,        
            comments: this.props.comments,
            activities: this.props.activities,
            showDescriptionInput: false,
            card: this.props.card
        }
        this.deleteCard = this.deleteCard.bind(this)
        this.updateDescriptionInput = this.updateDescriptionInput.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.updateDescription = this.updateDescription.bind(this)

    }

    render(){

        const memberPopup = {
            overflow: 'hidden'
        }

        const labelPopup = {
            overflow: 'hidden'
        }

        const checklistPopup = {
            overflow: 'hidden'
        }

        const attachmentPopup = {
            overflow: 'hidden'
        }

        const dueDatePopup = {
            overflow: 'hidden'
        }

        const movePopup = {
            overflow: 'hidden'
        }

        let descriptionInput  = null
        if(!this.state.showDescriptionInput) {
            descriptionInput = <p onClick={this.updateDescriptionInput} id="textDescription">{this.state.description || 'Edit the description'}</p>
        } else{
            descriptionInput = <textarea autoFocus="true" onChange={this.handleInputChange} onBlur={this.updateDescriptionInput} 
                            type="text" name="description" onKeyPress={this.handleKeyPress}>{this.state.description}</textarea>
        }
        
        return(
            <div className="popup">
                <div className="popupLeft">
                    <div className="inList"> In list {this.state.listTitle} </div>
                    <div id="inlineElements" className="space">
                        <div className="members inline"> <span className="spanTitle2"> members </span> 
                        
                        </div>
                        <div className="labels inline"> <span className="spanTitle2">labels </span> 
                        
                        </div>
                        <div className="dueDate inline"> <span className="spanTitle2">Due date </span> 
                        
                        </div>
                    </div>
                    <div className="description space"> <span className="spanTitle">description </span>
                        {descriptionInput}
                    </div>
                    <div className="checklists space"> <span className="spanTitle">checklists </span> 
                    
                    </div>
                    <div className="comments space">
                        <span className="spanTitle">comments </span>
                        <textarea>

                        </textarea>    
                    </div>
                    <div className="activities space"> <span className="spanTitle">activities </span> 
                    
                    </div>
                </div>

                <div className="popupRight">
                    <div className="popupAdd"> 
                        <h3> Add </h3>
                        <Button className='popupButton' onClick={() => this.addMember.show()}><Glyphicon glyph="user"/> Members</Button>
                        <Button className='popupButton' onClick={() => this.addLabel.show()}><Glyphicon glyph="tags"/> Labels</Button>
                        <Button className='popupButton' onClick={() => this.addChecklist.show()}><Glyphicon glyph="check"/> Checklists</Button>
                        <Button className='popupButton' onClick={() => this.addDueDate.show()}><Glyphicon glyph="time"/> Due date</Button>
                        <Button className='popupButton' onClick={() => this.addAttachment.show()}><Glyphicon glyph="paperclip"/> Attachment</Button>
                    </div>
                    <div className="popupActions">
                        <h3> Actions </h3>
                        <Button className='popupButton' onClick={() => this.moveCard.show()}><Glyphicon glyph="arrow-right"/> Move</Button>
                        <Button className='popupButton' onClick={this.deleteCard}><Glyphicon glyph="remove"/> Delete</Button>
                    </div>
                </div>

                <SkyLight dialogStyles={memberPopup} hideOnOverlayClicked ref={ref => this.addMember = ref} title='Add Member'>
                    <Member state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={labelPopup} hideOnOverlayClicked ref={ref => this.addLabel = ref} title='Add Label'>
                    <Label state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={checklistPopup} hideOnOverlayClicked ref={ref => this.addChecklist = ref} title='Add Checklist'>
                    <Checklist state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={dueDatePopup} hideOnOverlayClicked ref={ref => this.addDueDate = ref} title='Add Due Date'>
                    <DueDate state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={attachmentPopup} hideOnOverlayClicked ref={ref => this.addAttachment = ref} title='Add Attachment'>
                    <Attachment state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={movePopup} hideOnOverlayClicked ref={ref => this.moveCard = ref} title='Move Card'>
                    <MoveCard state={this.state}/>
                </SkyLight>

            </div>
        )
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ("description" === e.target.name) this.updateDescriptionInput()
        }
    }

    updateDescriptionInput() {
        if (this.state.showDescriptionInput){
            axios.put(url.api + 'card/' + this.props.cardId, {
                title : this.state.title,
                description : this.state.description,
                dueDate : this.state.dueDate,
                doneDate : this.state.doneDate,
                isArchived : this.state.isArchived
            }).then((response) => {
                // this.socket.emit('updateCard', response.data) not implemented yet
                this.updateDescription(response.data)
            })
            .catch((error) => {
                alert('An error occured when updating the list')
            })
        }
        this.setState({showDescriptionInput: !this.state.showDescriptionInput})
    }

    updateDescription(card){
        this.state.card.setState({description: card.description})
    }

    deleteCard(e){

    }
}

export default Popup
