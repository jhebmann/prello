import React from 'react'
import { Button, FormControl, Glyphicon, ProgressBar } from 'react-bootstrap'
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
        this.updateChecklists =this.updateChecklists.bind(this)

        //Event Listeners
        this.socket.on('updateCardClient', this.updateCard)
        this.socket.on('newChecklistClient', this.updateChecklists)
    }

    render(){

        const memberPopup = {
            overflow: 'auto'
        }

        const labelPopup = {
            overflow: 'auto'
        }

        const checklistPopup = {
            overflow: 'auto'
        }

        const attachmentPopup = {
            overflow: 'auto'
        }

        const dueDatePopup = {
            overflow: 'auto',
            height: '440px',
            width: '320px'
        }

        const movePopup = {
            overflow: 'auto'
        }

        let descriptionInput  = null
        if(!this.state.showDescriptionInput) {
            descriptionInput = <p onClick={this.updateDescriptionInput} id="textDescription">
                {(this.state.cardInfos.description.trim().length > 0) ? this.state.cardInfos.description : <span id="editDescription">Edit the description</span>}
            </p>
        } else{
            descriptionInput = <FormControl componentClass="textarea" autoFocus="true" onChange={this.handleInputChange} onBlur={this.updateDescriptionInput} type="text" 
            name="description" value={this.state.cardInfos.description} placeholder="Add a more detailed description..." className="inputPopup"/>                
        }

        const checklists = this.state.cardInfos.checklists
        const checklistsLi = checklists.map((x, i) =>
            <li className="listChecklist" key={i}>
                <Glyphicon glyph="check"/>{x.title}
                <div className="checklistProgressDiv">
                    <span className="percentageLabel">0%</span>
                    <ProgressBar className="checklistProgressBar" striped now={100*0.0/x.items.length} bsStyle="info"/>
                </div>
                <div className="inputPopup">
                    <FormControl type = "text" name = "newItem" placeholder = "Add an item..." className="checkListNewItemText"
                        /*onChange = {this.handleInputChange} id="addListInput" 
                        onFocus = {()=>this.setState({showSaveButton: !this.state.showSaveButton})} 
                        onBlur = {()=>this.setState({showSaveButton: !this.state.showSaveButton, titleNewList: ""})}*/ 
                        onKeyPress={this.handleKeyPress}
                    />
                </div>
            </li>
        )

        let dueDateClass = ["dueDateType"]
        const now = moment()
        const dueDate = new Date(this.state.cardInfos.dueDate)
        const today = new Date()
        
        if (this.state.cardInfos.doneDate) {
            dueDateClass.push("Done")
        }
        else if ( dueDate < today){
            dueDateClass.push("Late")
        }
        else if ((Math.abs(dueDate - now) / 36e5) < 72) {
            dueDateClass.push("Warning")
        }

        const dueDateRender = <div> <span className={dueDateClass.join("")+" dueDateColors"} id="dueDateCentered"><span id="checkboxNotDone"></span><span id="dateText">{moment(this.state.cardInfos.dueDate).format("MMM DD - HH:mm").toString().replace("-", "at")}</span></span></div>

        return(
            <div className="popup">
                <div className="popupLeft">
                    <div className="inList"> In list {this.state.listTitle} </div>
                    <div id="inlineElements" className="space">
                        <div className="members inline"> 
                            <span className="spanTitle2"> Members </span> 
                            {this.state.cardInfos.users} <Button className='circularButton' onClick={() => this.addMember.show()}><Glyphicon glyph="plus"/></Button>
                        </div>
                        <div className="labels inline"> 
                            <span className="spanTitle2">Labels </span> 
                            {this.state.cardInfos.labels} <Button className='circularButton' onClick={() => this.addLabel.show()}><Glyphicon glyph="plus"/></Button>
                        </div>
                        <div className="dueDate inline"> 
                            <span className="spanTitle2">Due date </span> 
                            {(this.state.cardInfos.dueDate) ? 
                                dueDateRender : 
                                <Button className='circularButton' onClick={() => this.addDueDate.show()
                            }>
                            <Glyphicon glyph="plus"/></Button>}
                        </div>
                    </div>
                    <div className="description space"> <span className="spanTitle"><Glyphicon glyph="menu-hamburger"/>Description </span>
                        <div className="inputPopup">
                            {descriptionInput}
                        </div>
                    </div>
                    <div className="checklists space"> <span className="spanTitle"><Glyphicon glyph="list-alt"/>Checklists </span> 
                        <ul>
                            {checklistsLi}
                        </ul>
                    </div>
                    <div className="comments space">
                        <span className="spanTitle"><Glyphicon glyph="comment"/>Comments </span>
                        <div className="inputPopup">
                            <FormControl componentClass="textarea">
                            </FormControl>
                        </div>    
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
                    <Member parentClose={this.handlePopupClose.bind(this)}/>
                </SkyLight>
                <SkyLight dialogStyles={labelPopup} hideOnOverlayClicked ref={ref => this.addLabel = ref} title='Add Label'>
                    <Label parentClose={this.handlePopupClose.bind(this)}/>
                </SkyLight>
                <SkyLight dialogStyles={checklistPopup} hideOnOverlayClicked ref={ref => this.addChecklist = ref} title='Add Checklist'>
                    <Checklist checklists={this.state.cardInfos.checklists} popup={this} card={this.state.card} io={this.socket} />
                </SkyLight>
                <SkyLight dialogStyles={dueDatePopup} hideOnOverlayClicked ref={ref => this.addDueDate = ref} title='Change Due Date'>
                    <DueDate dueDate={this.state.cardInfos.dueDate} popup={this} card={this.state.card} io={this.socket} parentClose={this.handlePopupClose.bind(this)}/>
                </SkyLight>
                <SkyLight dialogStyles={attachmentPopup} hideOnOverlayClicked ref={ref => this.addAttachment = ref} title='Add Attachment'>
                    <Attachment attachments={this.state.cardInfos.attachments} popup={this} card={this.state.card} io={this.socket} parentClose={this.handlePopupClose.bind(this)}/>
                </SkyLight>
                <SkyLight dialogStyles={movePopup} hideOnOverlayClicked ref={ref => this.moveCard = ref} title='Move Card'>
                    <MoveCard/>
                </SkyLight>

            </div>
        )
    }

    handlePopupClose(namePopupToHide){
        if ("member" === namePopupToHide) this.addMember.hide()
        else if ("label" === namePopupToHide) this.addLabel.hide()
        else if ("dueDate" === namePopupToHide) this.addDueDate.hide()
        else if ("attachment" === namePopupToHide) this.addAttachment.hide()
    }

    handleInputChange = (e) => {
        let newCardInfos = this.state.cardInfos
        newCardInfos.description = e.target.value
        this.setState({cardInfos: newCardInfos})
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ("description" === e.target.name) this.updateDescriptionInput()
            else if ("newItem" === e.target.name) console.log(e)
        }
    }

    updateDescriptionInput() {
        if (this.state.showDescriptionInput){
            axios.put(url.api + 'card/' + this.state.cardInfos._id, {
                title : this.state.title,
                description : this.state.cardInfos.description.trim(),
                dueDate : this.state.cardInfos.dueDate,
                doneDate : this.state.cardInfos.doneDate,
                isArchived : this.state.cardInfos.isArchived
            }, url.config).then((response) => {
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

    updateChecklists(checklist){
        let newCardInfos = this.state.cardInfos
        newCardInfos.checklists.push(checklist)
        this.setState({
            cardInfos: newCardInfos
        })
    }
}

export default Popup
