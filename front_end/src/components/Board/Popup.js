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
import moment from 'moment'

class Popup extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            listTitle: this.props.listTitle,
            card: this.props.card,
            cardInfos: this.props.cardInfos,
            showDescriptionInput: false
        }

        this.socket = this.props.io
        this.deleteCard = this.deleteCard.bind(this)
        this.updateDescriptionInput = this.updateDescriptionInput.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.updateCard = this.updateCard.bind(this)

        //Event Listeners
        this.socket.on('updateCardClient', this.updateCard)
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
            overflow: 'auto'
        }

        const movePopup = {
            overflow: 'hidden'
        }

        let descriptionInput  = null
        if(!this.state.showDescriptionInput) {
            descriptionInput = <p onClick={this.updateDescriptionInput} id="textDescription">{this.state.cardInfos.description || 'Edit the description'}</p>
        } else{
            descriptionInput = <textarea autoFocus="true" onChange={this.handleInputChange} onBlur={this.updateDescriptionInput} 
                            type="text" name="description" onKeyPress={this.handleKeyPress} value={this.state.cardInfos.description}></textarea>
        }
        
        return(
            <div className="popup">
                <div className="popupLeft">
                    <div className="inList"> In list {this.state.listTitle} </div>
                    <div id="inlineElements" className="space">
                        <div className="members inline"> 
                            <span className="spanTitle2"> members </span> 
                            {this.state.cardInfos.users + '+'}
                        </div>
                        <div className="labels inline"> 
                            <span className="spanTitle2">labels </span> 
                            {this.state.cardInfos.labels + '+'}
                        </div>
                        <div className="dueDate inline"> 
                            <span className="spanTitle2">Due date </span> 
                            {(this.state.cardInfos.dueDate) ? moment(this.state.cardInfos.dueDate).format('DD MMM') : '+'}
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
                    <Checklist checklists={this.state.cardInfos.checklists}/>
                </SkyLight>
                <SkyLight dialogStyles={dueDatePopup} hideOnOverlayClicked ref={ref => this.addDueDate = ref} title='Change Due Date'>
                    <DueDate dueDate={this.state.cardInfos.dueDate} popup={this} card={this.state.card} io={this.socket}/>
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
        let newCardInfos = this.state.cardInfos
        newCardInfos.description = e.target.value
        this.setState({cardInfos: newCardInfos})
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ("description" === e.target.name) this.updateDescriptionInput()
        }
    }

    updateDescriptionInput() {
        if (this.state.showDescriptionInput){
            console.log(this.state)
            console.log(this.state.cardInfos)
            console.log(this.state.cardInfos._id)
            axios.put(url.api + 'card/' + this.state.cardInfos._id, {
                title : this.state.title,
                description : this.state.cardInfos.description,
                dueDate : this.state.cardInfos.dueDate,
                doneDate : this.state.cardInfos.doneDate,
                isArchived : this.state.cardInfos.isArchived
            }).then((response) => {
                this.socket.emit('updateCardServer', response.data)
                this.updateCard(response.data)
            })
            .catch((error) => {
                alert('An error occured when updating the list')
            })
        }
        this.setState({showDescriptionInput: !this.state.showDescriptionInput})
    }

    updateCard(card){
        if (card._id === this.state.cardInfos._id){
            let newCardInfos = this.state.cardInfos
            newCardInfos.dueDate = card.dueDate
            newCardInfos.description = card.description
            this.state.card.setState({cardInfos: newCardInfos})
        }
    }

    deleteCard(e){

    }
}

export default Popup
