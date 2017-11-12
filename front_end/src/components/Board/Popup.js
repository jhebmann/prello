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
import Markdown from 'react-remarkable'



class Popup extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            listTitle: this.props.listTitle,
            card: this.props.card,
            cardInfos: this.props.cardInfos,
            attachments: this.props.attachments,
            showDescriptionInput: false,
            showCardTitle: false,
            showChecklists: []
        }

        this.socket = this.props.io
        this.deleteCard = this.deleteCard.bind(this)
        this.updateTitleInput = this.updateTitleInput.bind(this)
        this.updateDescriptionInput = this.updateDescriptionInput.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.updateCard = this.updateCard.bind(this)
        this.updateChecklists =this.updateChecklists.bind(this)
        this.updateDoneDate = this.updateDoneDate.bind(this)
        this.onClickDeleteChecklist = this.onClickDeleteChecklist.bind(this)
        this.onClickChecklistShow = this.onClickChecklistShow.bind(this)
        this.updateTitleChecklist = this.updateTitleChecklist.bind(this)

        //Event Listeners
        this.socket.on('updateCardClient', this.updateCard)
        this.socket.on('newChecklistClient', this.updateChecklists)
        this.socket.on('updateChecklistTitleClient', this.updateTitleChecklist)
        console.log(this.state.attachments)
    }

    componentWillReceiveProps(newProps) {
        this.setState({attachments: newProps.attachments});
    }

    componenWillMount() {
        this.setState({showChecklists : this.state.cardInfos.checklists.map(() => false)})
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
            overflow: 'auto',
            height: '90%',
            width: '60%',
            top: '210px'
        }

        const dueDatePopup = {
            overflow: 'auto',
            height: '440px',
            width: '320px',
        }

        const movePopup = {
            overflow: 'auto'
        }

        let descriptionInput  = null
        if(!this.state.showDescriptionInput) {
            descriptionInput = <div onClick={this.updateDescriptionInput} id="textDescription">
                {(this.state.cardInfos.description.trim().length > 0) ? <Markdown source={this.state.cardInfos.description} /> : <span id="editDescription">Edit the description</span>}
            </div>
        } else{
            descriptionInput = <FormControl componentClass="textarea" autoFocus="true" onChange={this.handleInputChange} onBlur={this.updateDescriptionInput} type="text" 
            name="description" value={this.state.cardInfos.description} placeholder="Add a more detailed description..." className="inputPopup"/>                
        }

        const checklists = this.state.cardInfos.checklists
        const checklistsLi = checklists.map((x, i) =>
            <li className="listChecklist" key={i}>
                {(!this.state.showChecklists[i]) ? 
                (<div className="checklistTitleDiv">
                    <div>
                        <Glyphicon glyph="check"/>
                        <span className="checklistTitleSpan" onClick={this.onClickChecklistShow} index={i}>{x.title}</span>   
                    </div>
                    <span className="deleteChecklistSpan" checklistid = {x._id} onClick={this.onClickDeleteChecklist}>Delete..</span>
                </div>) :
                (<div className="inputCheklistUpdate" onBlur={this.onClickChecklistShow} >
                    <FormControl componentClass="input" name="checklistTitle" autoFocus="true" type="text" 
                        index={i} value={x.title} onChange={this.handleInputChange}
                    />
                </div>)}
                <div className="checklistProgressDiv">
                    <span className="percentageLabel">0%</span>
                    <ProgressBar className="checklistProgressBar" striped now={100*0.0/x.items.length} bsStyle="info"/>
                </div>
                <div className="inputPopup">
                    <FormControl type = "textarea" name = "newItem" placeholder = "Add an item..." className="checkListNewItemText"
                        checklistid = {x._id} defaultValue = "" onKeyPress={this.handleKeyPress}
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
        else {
            dueDateClass.push("Standard")
        }

        const dueDateRender = 
            <div id="dueDatePopupDiv"> 
                <span className={dueDateClass.join("")+" dueDateColors"} id="dueDateCentered">
                    <span id="checkboxNotDone" onClick={this.updateDoneDate}>
                        {(this.state.cardInfos.doneDate) ? <Glyphicon glyph='ok'/> : ""}
                    </span>
                    <span id="dateText" onClick={() => this.addDueDate.show()}>
                        {moment(this.state.cardInfos.dueDate).format("MMM DD - HH:mm").toString().replace("-", "at")}
                    </span>
                </span>
            </div>

        let cardInputTitle  = null
        if(!this.state.showCardTitle) {
            cardInputTitle = <h2 onClick={this.updateTitleInput}>{this.state.cardInfos.title}</h2>
        } else{
            cardInputTitle = <FormControl componentClass="input" autoFocus="true" onChange={this.handleInputChange} onBlur={this.updateTitleInput} type="text" 
            name="cardTitle" value={this.state.cardInfos.title} placeholder="Title" id="titleCardPopup" onKeyPress={this.handleKeyPress}/>                
        }

        return(
            <div className="popup">
                <div id="divTitlePopup">
                    {cardInputTitle}
                </div>
                <div className="popupLeft">
                    <div className="inList"> In list <span id="spanTitlePopup">{this.state.listTitle}</span> </div>
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
                            {
                                (this.state.cardInfos.dueDate) ? 
                                dueDateRender : 
                                <Button className='circularButton' onClick={() => this.addDueDate.show()}>
                                <Glyphicon glyph="plus"/></Button>
                            }
                        </div>
                    </div>
                    <div className="description space"> <span className="spanTitle"><Glyphicon glyph="menu-hamburger"/>Description </span>
                        <div className="inputPopup">
                            {descriptionInput}
                        </div>
                    </div>
                    <div className="checklists space"> <span className="spanTitle checklistsSpan"><Glyphicon glyph="list-alt"/>Checklists </span> 
                        <ul>
                            {checklistsLi}
                        </ul>
                    </div>
                    <div className="attachments space"> <span className="spanTitle attachmentsSpan"><Glyphicon glyph="list-alt"/>Attachments</span> 
                        <ul>
                            {/* put image here */}
                        </ul>
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
        if (e.target.name === "description") {
            let newCardInfos = this.state.cardInfos
            newCardInfos.description = e.target.value
            this.setState({cardInfos: newCardInfos})
        }
        else if (e.target.name === "cardTitle") {
            let newCardInfos = this.state.cardInfos
            newCardInfos.title = e.target.value
            this.setState({cardInfos: newCardInfos})
        }
        else if (e.target.name === "checklistTitle") {
            let newCardInfos = this.state.cardInfos
            newCardInfos.checklists[e.target.attributes.index.value].title = e.target.value
            this.setState({cardInfos: newCardInfos})
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ("description" === e.target.name) this.updateDescriptionInput()
            else if ("newItem" === e.target.name) {
                console.log(e.target)
                console.log(e.view)
            }
            else if ("cardTitle" === e.target.name) this.updateTitleInput()
        }
    }

    onClickChecklistShow(e) {
        const index = e.target.attributes.index.value
        if (this.state.showChecklists[index] && this.state.cardInfos.checklists[index].title.trim().length > 0){
            axios.put(url.api + 'checklist/' + this.state.cardInfos.checklists[index]._id + '/card/' + this.state.cardInfos._id, {
                title : this.state.cardInfos.checklists[index].title.trim(),
            }, url.config).then((response) => {
                this.socket.emit('updateChecklistTitleServer', response.data)
            })
            .catch((error) => {
                alert('An error occured when updating the list')
            })
        }
        let newShowChecklists = this.state.showChecklists
        newShowChecklists[index] = !newShowChecklists[index]
        this.setState({showChecklists: newShowChecklists})
    }

    onClickDeleteChecklist(e) {
        console.log(e.target)
        axios.delete(url.api + 'checklist/' + e.target.checklistid + '/card/' + this.state.cardInfos._id, url.config)
        .then((response) => {
            console.log(1)
            this.socket.emit('deleteChecklistServer', response.data)
            console.log(response.data)
        })
        .catch((error) => {
            alert('An error occured when updating the list')
        })
    }

    updateDoneDate() {
        let newDoneDate = null
        if (!this.state.cardInfos.doneDate) {
            newDoneDate = new Date()
        }
        axios.put(url.api + 'card/' + this.state.cardInfos._id, {
            doneDate : newDoneDate,
        }, url.config).then((response) => {
            this.socket.emit('updateCardServer', response.data)
            this.updateCard(response.data)
        })
        .catch((error) => {
            alert('An error occured when updating the list')
        })
    }

    updateDescriptionInput() {
        if (this.state.showDescriptionInput){
            axios.put(url.api + 'card/' + this.state.cardInfos._id, {
                description : this.state.cardInfos.description.trim(),
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

    updateTitleInput() {
        if (this.state.showCardTitle){
            if (this.state.cardInfos.title.trim().length === 0) {
                axios.get(url.api + 'card/' + this.state.cardInfos._id, url.config)
                .then((response) => {
                    let newCardInfos = this.state.cardInfos
                    newCardInfos.title = response.data.title
                    this.setState({cardInfos: newCardInfos})
                })
                .catch((error) => {
                    alert('An error occured when getting the cards')
                })
            }
            else{
                axios.put(url.api + 'card/' + this.state.cardInfos._id, {
                    title : this.state.cardInfos.title.trim(),
                }, url.config).then((response) => {
                    this.socket.emit('updateCardServer', response.data)
                    this.updateCard(response.data)
                })
                .catch((error) => {
                    alert('An error occured when updating the list')
                })
            }
        }
        this.setState({showCardTitle: !this.state.showCardTitle})
    }

    updateCard(card){
        if (card._id === this.state.cardInfos._id){
            let newCardInfos = this.state.cardInfos
            newCardInfos.title = card.title
            newCardInfos.dueDate = card.dueDate
            newCardInfos.description = card.description
            newCardInfos.doneDate = card.doneDate
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

    updateTitleChecklist(checklist){
        let newCardInfos = this.state.cardInfos
        newCardInfos.checklists[newCardInfos.checklists.map((el) => el._id).indexOf(checklist._id)] = checklist
        this.setState({
            cardInfos: newCardInfos
        })
    }
}

export default Popup
