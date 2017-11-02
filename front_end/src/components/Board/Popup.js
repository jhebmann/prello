import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import SkyLight from 'react-skylight'
import Attachment from './popups/Attachment'
import Checklist from './popups/Checklist'
import DueDate from './popups/DueDate'
import Label from './popups/Label'
import Member from './popups/Member'
import MoveCard from './popups/MoveCard'

class Popup extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="popup">
                <div className="popupLeft">
                    <div className="popupList"> In list {this.state.listTitle} </div>
                    <div className="popupMembers"> members </div>
                    <div className="popupLabels"> labels </div>
                    <div className="popupDescritpion"> description </div>
                    <div className="popupChecklists"> checklists </div>
                    <div className="popupComments"> comments </div>
                    <div className="popupActivities"> activities </div>
                </div>
                <div className="popupRight">
                    <div className="popupAdd"> 
                        <h3> Add </h3>
                        <Button className='popupButton' onClick={() => this.addMember.show()}><Glyphicon glyph="user"/> Members</Button>
                        <Button className='popupButton' onClick={() => this.addLabel.show()}><Glyphicon glyph="tag"/> Labels</Button>
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
                <SkyLight dialogStyles={''/*memberPopup*/} hideOnOverlayClicked ref={ref => this.addMember = ref} title='Add Member'>
                    <Member state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={''/*labelPopup*/} hideOnOverlayClicked ref={ref => this.addLabel = ref} title='Add Label'>
                    <Label state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={''/*checklistPopup*/} hideOnOverlayClicked ref={ref => this.addChecklist = ref} title='Add Checklist'>
                    <Checklist state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={''/*dueDatePopup*/} hideOnOverlayClicked ref={ref => this.addDueDate = ref} title='Add Due Date'>
                    <DueDate state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={''/*attachmentPopup*/} hideOnOverlayClicked ref={ref => this.addAttachment = ref} title='Add Attachment'>
                    <Attachment state={this.state}/>
                </SkyLight>
                <SkyLight dialogStyles={''/*movePopup*/} hideOnOverlayClicked ref={ref => this.moveCard = ref} title='Move Card'>
                    <MoveCard state={this.state}/>
                </SkyLight>
            </div>
        )
    }
}

export default Popup
