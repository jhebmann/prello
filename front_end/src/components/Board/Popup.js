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
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import {Tooltip} from 'antd'
import Avatar from 'react-avatar'

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

        ////////////////////// Socket //////////////////////
        this.socket = this.props.io

        ////////////////// Interface handler ///////////////////
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onClickChecklistShow = this.onClickChecklistShow.bind(this)
        this.onClickItemInput = this.onClickItemInput.bind(this)

        ////////////////////// Card //////////////////////
        this.updateCard = this.updateCard.bind(this)
        this.updateDoneDate = this.updateDoneDate.bind(this)
        this.updateTitleInput = this.updateTitleInput.bind(this)
        this.updateDescriptionInput = this.updateDescriptionInput.bind(this)
        this.onClickDeleteCard = this.onClickDeleteCard.bind(this)
        
        //////////////////// Attachments ////////////////////
        this.updateAttachments =this.updateAttachments.bind(this)
        this.onClickDeleteAttachment = this.onClickDeleteAttachment.bind(this)
        this.deleteAttachment = this.deleteAttachment.bind(this)

        //////////////////// Checklists ////////////////////
        this.addChecklist = this.addChecklist.bind(this)
        this.updateTitleChecklist = this.updateTitleChecklist.bind(this)
        this.onClickDeleteChecklist = this.onClickDeleteChecklist.bind(this)
        this.deleteChecklist = this.deleteChecklist.bind(this)

        //////////////////// Items ////////////////////
        this.addItem = this.addItem.bind(this)
        this.OnclickUpdateItemIsDone = this.OnclickUpdateItemIsDone.bind(this)
        this.updateItem = this.updateItem.bind(this)
        this.onClickDeleteItem = this.onClickDeleteItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)

        ////////////////// Event Listeners //////////////////
        this.socket.on('updateCardClient', this.updateCard)
        this.socket.on('newChecklistClient', this.addChecklist)
        this.socket.on('updateChecklistTitleClient', this.updateTitleChecklist)
        this.socket.on('deleteChecklistClient', this.deleteChecklist)
        this.socket.on('newAttachmentClient', this.updateAttachments)
        this.socket.on('updateAttachmentTitleClient', this.updateTitleAttachment)
        this.socket.on('deleteAttachmentClient', this.deleteAttachment)
        this.socket.on('postItemClient', this.addItem)
        this.socket.on('updateItemClient', this.updateItem)
        this.socket.on('deleteItemClient', this.deleteItem)
    }

    
    componentWillReceiveProps(newProps) {
        this.setState({attachments: newProps.attachments})
    }

    componentWillMount() {
        const newShowChecklists = this.props.cardInfos.checklists.map(c => { return { 
            showChecklist: false,
            itemState: c.items.map(item => false)
        }})
        this.setState({showChecklists: newShowChecklists})
    }

    render(){
        ////////////////// Popups style //////////////////   
        const memberPopup = {
            overflow: 'auto'
        }

        const labelPopup = {
            overflow: 'auto'
        }

        const checklistPopup = {
            height: '35%'
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

        ////////////////// Card description //////////////////
        let descriptionInput  = null
        if(!this.state.showDescriptionInput) {
            descriptionInput = <div onClick={this.updateDescriptionInput} id="textDescription">
                {(this.state.cardInfos.description.trim().length > 0) ? <Markdown source={this.state.cardInfos.description} /> : <span id="editDescription">Edit the description</span>}
            </div>
        } else{
            descriptionInput = <FormControl componentClass="textarea" autoFocus="true" onChange={this.handleInputChange} onBlur={this.updateDescriptionInput} type="text" 
            name="description" value={this.state.cardInfos.description} placeholder="Add a more detailed description..." className="inputPopup"/>                
        }

        ////////////////// Checklist render //////////////////
        const checklists = this.state.cardInfos.checklists
        const checklistsLi = checklists.map((checklist, i) =>
            <li className="listChecklist" key={i}>
                {(!this.state.showChecklists[i].showChecklist) ? 
                (<div className="checklistTitleDiv">
                    <div className="editChecklistDiv">
                        <Glyphicon glyph="check"/>
                        <div className="checklistTitleSpan" onClick={this.onClickChecklistShow} index={i}>{checklist.title}</div>   
                    </div>
                    <span className="deleteChecklistSpan" checklistid = {checklist._id} onClick={this.onClickDeleteChecklist}>Delete..</span>
                </div>) :
                (<div className="inputCheklistUpdate" onBlur={this.onClickChecklistShow} >
                    <FormControl componentClass="input" name="checklistTitle" autoFocus="true" type="text" 
                        index={i} value={checklist.title} onChange={this.handleInputChange}
                    />
                </div>)}
                {checklist.items.length > 0 &&
                    <div className="checklistProgressDiv">
                        <span className="percentageLabel">
                            {Math.round(100.0 * checklist.items.filter(item => {return item.isDone}).length / checklist.items.length)}%
                        </span>
                        <ProgressBar className="checklistProgressBar" striped 
                            now = {100.0 * checklist.items.filter(item => {return item.isDone}).length / checklist.items.length} bsStyle="info"
                        />
                    </div>
                }
                <div>
                    <div>
                        <ul>
                            {
                                (checklist.items && checklist.items.length > 0) &&
                                checklist.items.map((item, j) =>
                                    <li key={item._id}>
                                        {
                                            (this.state.showChecklists[i].itemState[j]) ?
                                                (<div className="inputItemUpdate" onBlur={() => this.onClickItemInput(item.title, i, j, checklist._id, item._id)} >
                                                    <FormControl componentClass="input" name="itemTitle" autoFocus="true" type="text" 
                                                        checklistindex={i} itemindex={j} value={item.title} onChange={this.handleInputChange}
                                                    />
                                                </div>)
                                            :
                                                (<div className="itemDiv"> 
                                                    <div className={(item.isDone) ? "item done" : "item notDone"}>
                                                        <span className={(item.isDone) ? "checkboxItemDone" : "checkboxItemNotDone"} onClick={() => {this.OnclickUpdateItemIsDone(item, checklist)}}>
                                                            {(item.isDone) && <Glyphicon glyph='ok' className="myGlyphOk"/>}
                                                        </span>
                                                        <div className="itemTitleDiv"
                                                            onClick={() => this.onClickItemInput(item.title, i, j, checklist._id, item._id)}>
                                                            <span>{item.title}</span>
                                                            <span onClick={(e) => {this.handleItemDelete(e, item._id, checklist._id)}}><Glyphicon glyph='remove' className="glyphRemoveItem"/></span>
                                                        </div>
                                                    </div>
                                                </div>)
                                        }
                                    </li> 
                                )
                            }
                        </ul>
                    </div>
                    <div className="inputPopup">
                        <FormControl type = "input" name = "newItem" placeholder = "Add an item..." className = "checkListNewItemText"
                            checklistid = {checklist._id} onKeyPress = {this.handleKeyPress}
                        />
                    </div>
                </div>
            </li>
        )

       ////////////////// Due date render //////////////////
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
                        {(this.state.cardInfos.doneDate) && <Glyphicon glyph='ok'/>}
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

        ////////////////// Attachments render //////////////////
        let attachmentsList = this.state.attachments.map((attachment, i) => 
            <li className="listAttachment col-sm-6" key={i}>
                <div className = "attachmentInfos">
                    <Glyphicon glyph="camera"/>
                    <span className = "attachmentTitle">{attachment.title ? attachment.title : "No title"}</span>
                </div>
                <span className="deleteAttachmentSpan" attachmentid = {attachment._id} onClick={this.onClickDeleteAttachment}>Delete..</span>
                <img src={"data:image/jpegbase64," + attachment.image} alt={attachment.title ? attachment.title : "Undefined"}/>
            </li>
        )
        ///////////////////////////////////////////////////

        return(
            <div className="popup">
                <div id="divTitlePopup">
                    {cardInputTitle}
                </div>
                {/*//////////////// Left Menu /////////////////*/}
                <div className="popupLeft">
                    <div className="inList"> In list <span id="spanTitlePopup">{this.state.listTitle}</span> </div>
                    <div id="inlineElements" className="space">
                        <div className="members inline"> 
                            <span className="spanTitle2"> Members </span>
                            <div className="membersAssigned"> 
                                {this.renderMembers(this.state.cardInfos.users)}
                                <Button className='circularButton' onClick={() => this.addMember.show()}>
                                    <Glyphicon glyph="plus"/>
                                </Button>
                            </div>
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
                    { (this.state.cardInfos.checklists && this.state.cardInfos.checklists.length > 0) &&
                        <div className="checklists space"> <span className="spanTitle checklistsSpan"><Glyphicon glyph="list-alt"/>Checklists </span> 
                            <ul>
                                {checklistsLi}
                            </ul>
                        </div>
                    }
                    { (this.state.attachments && this.state.attachments.length > 0) &&
                        <div className="attachments space"> <span className="spanTitle attachmentsSpan"><Glyphicon glyph="paperclip"/>Attachments</span> 
                            <ul>
                                {attachmentsList}
                            </ul>
                        </div>
                    }
                </div>

                {/*//////////////// Right Menu /////////////////*/}
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
                        {/*<Button className='popupButton' onClick={() => this.moveCard.show()}><Glyphicon glyph="arrow-right"/> Move</Button>*/}
                        <Button className='popupButton' onClick={this.onClickDeleteCard}><Glyphicon glyph="remove"/> Delete</Button>
                    </div>
                </div>

                {/*//////////////// Popups Render /////////////////*/}
                <SkyLight dialogStyles={memberPopup} hideOnOverlayClicked ref={ref => this.addMember = ref} title='Add Member'>
                    <Member popup={this} card={this.state.card} parentClose={this.handlePopupClose.bind(this)} usersBoard={this.props.usersBoard} io={this.socket} cardInfos={this.state.cardInfos}/>
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
                    <Attachment attachments={this.state.cardInfos.attachments} popup={this} card={this.state.card} io={this.socket} parentClose={this.handlePopupClose.bind(this)} dropbox={this.props.dropbox}/>
                </SkyLight>
                <SkyLight dialogStyles={movePopup} hideOnOverlayClicked ref={ref => this.moveCard = ref} title='Move Card'>
                    <MoveCard/>
                </SkyLight>

            </div>
        )
    }

    ////////////////////// Interface handler //////////////////////
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
        else if (e.target.name === "itemTitle") {
            let newCardInfos = this.state.cardInfos
            newCardInfos.checklists[e.target.attributes.checklistindex.value].items[e.target.attributes.itemindex.value].title = e.target.value
            this.setState({cardInfos: newCardInfos})
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ("description" === e.target.name) this.updateDescriptionInput()
            else if ("newItem" === e.target.name) {
                if (e.target.value.trim().length > 0) {
                    this.postItem(e.target.value.trim(), e.target.attributes.checklistId.value)
                    e.target.value = ""
                }
            }
            else if ("cardTitle" === e.target.name) this.updateTitleInput()
        }
    }

    onClickChecklistShow(e) {
        const index = e.target.attributes.index.value
        if (this.state.showChecklists[index].showChecklist){
            if (this.state.cardInfos.checklists[index].title.trim().length > 0) {
                axios.put(url.api + 'checklist/' + this.state.cardInfos.checklists[index]._id + '/card/' + this.state.cardInfos._id, {
                    title : this.state.cardInfos.checklists[index].title.trim(),
                }, url.config).then((response) => {
                    this.socket.emit('updateChecklistTitleServer', response.data)
                })
                .catch((error) => {
                    alert('An error occured when updating the checklist title')
                })
            }
            else {
                axios.get(url.api + 'checklist/' + this.state.cardInfos.checklists[index]._id + '/card/' + this.state.cardInfos._id, url.config)
                .then((response) => {
                    this.socket.emit('updateChecklistTitleServer', response.data)
                })
                .catch((error) => {
                    alert('An error occured when updating the list')
                })
            }
        }
        let newShowChecklists = this.state.showChecklists
        newShowChecklists[index].showChecklist = !newShowChecklists[index].showChecklist
        this.setState({showChecklists: newShowChecklists})
    }

    onClickItemInput(titleItem, checklistIndex, itemIndex, checklistId, itemId){
        if (this.state.showChecklists[checklistIndex].itemState){
            if (titleItem.trim().length > 0) {
                axios.put(url.api + 'item/' + itemId + "/checklist/" + checklistId + '/card/' + this.state.cardInfos._id, {
                    title : titleItem
                }, url.config)
                .then((response) => {
                    this.updateItem(response.data, checklistId)
                    this.socket.emit('updateItemServer', response.data, checklistId)
                })
                .catch((error) => {
                    alert('An error occured when updating the checklist title')
                })
            }
        }
        let newShowChecklists = this.state.showChecklists
        newShowChecklists[checklistIndex].itemState[itemIndex] = !newShowChecklists[checklistIndex].itemState[itemIndex]
        this.setState({showChecklists: newShowChecklists})
    }

    renderMembers(){
        const users = 
            this.props.usersBoard.filter(usr=>this.state.cardInfos.users.includes(usr._id)).map((usr,index)=>
                <div key = {index} className="avatarDiv">
                    <Tooltip title = {usr.local.nickname} >
                        <div>
                            <Avatar name={usr.local.nickname} size={23} textSizeRatio={1.5} round/>
                        </div>
                    </Tooltip>
                </div>
            )
        return users
    }

    ////////////////////// Card //////////////////////
    updateCard(card){
        if (card._id === this.state.cardInfos._id){
            let newCardInfos = this.state.cardInfos
            newCardInfos.title = card.title
            newCardInfos.dueDate = card.dueDate
            newCardInfos.description = card.description
            newCardInfos.doneDate = card.doneDate
            newCardInfos.users = card.users
            this.state.card.setState({cardInfos: newCardInfos})
        }
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
                    alert('An error occured when updating the card title')
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
                    alert('An error occured when updating the card title')
                })
            }
        }
        this.setState({showCardTitle: !this.state.showCardTitle})
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
                alert('An error occured when the card description')
            })
        }
        this.setState({showDescriptionInput: !this.state.showDescriptionInput})
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
            alert('An error occured when updating the done date')
        })
    }

    onClickDeleteCard() {
        confirmAlert({
            title: 'Delete the card ' + this.state.cardInfos.title + '?',
            message: 'This card will be removed and you won\'t be able to re-open it. There is no undo !',
            confirmLabel: 'Delete',                           // Text button confirm
            cancelLabel: 'Cancel',                             // Text button cancel
            onConfirm: () => (
                axios.delete(url.api + 'card/' + this.state.cardInfos._id + '/list/' + this.props.listId + '/board/' + this.props.boardId, url.config)
                .then((response) => {
                    this.socket.emit('deleteCardServer', this.state.cardInfos._id)
                })
                .catch((error) => {
                    alert('An error occured when deleting the card')
                })
            )
        })
    }
    
    ////////////////////// Attachments //////////////////////
    onClickDeleteAttachment(e) {
        const attachmentId = e.target.attributes.attachmentId.value
        axios.delete(url.api + 'attachment/' + attachmentId + '/card/' + this.state.cardInfos._id, url.config)
        .then((response) => {
            this.socket.emit('deleteAttachmentServer', attachmentId)
            this.deleteAttachment(attachmentId)
        })
        .catch((error) => {
            alert('An error occured when deleting the attachment')
        })
    }
    
    updateAttachments(attachment){
        let newAttachments = this.state.attachments
        newAttachments.unshift(attachment)
        this.setState({
            attachments: newAttachments
        })
    }
    
    updateTitleAttachment(attachment){
        let newAttachments = this.state.attachments
        newAttachments[newAttachments.map((el) => el._id).indexOf(attachment._id)] = attachment
        this.setState({
            attachments: newAttachments
        })
    }

    deleteAttachment(attachmentId) {
        let newCardInfos = this.state.cardInfos
        newCardInfos.attachments = newCardInfos.attachments.filter(x => x._id !== attachmentId)
        let newAttachments = this.state.attachments.filter(x => x._id !== attachmentId)
        this.setState({
            cardInfos: newCardInfos,
            attachments: newAttachments
        })
    }

    ////////////////////// Checklists //////////////////////
    onClickDeleteChecklist(e) {
        const checklistId = e.target.attributes.checklistid.value
        axios.delete(url.api + 'checklist/' + checklistId + '/card/' + this.state.cardInfos._id, url.config)
        .then((response) => {
            this.socket.emit('deleteChecklistServer', checklistId)
            this.deleteChecklist(checklistId)
        })
        .catch((error) => {
            alert('An error occured when deleting the checklist')
        })
    }

    addChecklist(checklist){
        let newCardInfos = this.state.cardInfos
        newCardInfos.checklists.push(checklist)
        const newShowChecklists = newCardInfos.checklists.map(c => { return { 
            showChecklist: false,
            itemState: c.items.map(item => false)
        }})

        this.setState({
            cardInfos: newCardInfos,
            showChecklists: newShowChecklists
        })

        this.state.card.setState({
            cardInfos: newCardInfos
        })
    }

    updateTitleChecklist(newChecklist){
        let newCardInfos = this.state.cardInfos
        newCardInfos.checklists[newCardInfos.checklists.map(checklist => checklist._id).indexOf(newChecklist._id)] = newChecklist
        this.setState({
            cardInfos: newCardInfos
        })
    }

    deleteChecklist(checklistId) {
        let newCardInfos = this.state.cardInfos
        newCardInfos.checklists = newCardInfos.checklists.filter(x => x._id !== checklistId)
        this.setState({
            cardInfos: newCardInfos
        })
        this.state.card.setState({
            cardInfos: newCardInfos
        })
    }
    ////////////////////// Items //////////////////////

    postItem(titleItem, checklistId) {
        axios.post(`${url.api}item/checklist/${checklistId}/card/${this.state.cardInfos._id}`,
            {
                title: titleItem
            }, url.config
        ).then((response) => {
            this.socket.emit('postItemServer', response.data, checklistId)
            this.addItem(response.data, checklistId)
        })
        .catch((error) => {
            alert('An error occured when deleting the checklist')
        })
    }

    addItem(newItem, checklistId) {
        let newCardInfos = this.state.cardInfos
        const index = newCardInfos.checklists.findIndex(el => el._id === checklistId)
        if (index !== -1) {
            newCardInfos.checklists[index].items.push(newItem)
            this.setState({
                cardInfos: newCardInfos
            })
            this.state.card.setState({
                cardInfos: newCardInfos
            })
        }
    }

    OnclickUpdateItemIsDone(item, checklist) {
        const checklistIndex = this.state.cardInfos.checklists.findIndex(oldChecklist => oldChecklist._id === checklist._id)
        if (-1 !== checklistIndex) {
            const itemIndex = this.state.cardInfos.checklists[checklistIndex].items.findIndex(oldItem => oldItem._id === item._id)
            if (-1 !== itemIndex) {
                axios.put(url.api + 'item/' + item._id + "/checklist/" + checklist._id + '/card/' + this.state.cardInfos._id, {
                    isDone : !this.state.cardInfos.checklists[checklistIndex]
                                .items[itemIndex].isDone
                }, url.config)
                .then((response) => {
                    this.updateItem(response.data, checklist._id)
                    this.socket.emit('updateItemServer', response.data, checklist._id)
                })
                .catch((error) => {
                    alert('An error occured when updating the checklist title')
                })
            }
        }
    }

    updateItem(newItem, checklistId) {
        let newCardInfos = this.state.cardInfos
        const checklistIndex = newCardInfos.checklists.findIndex(checklist => checklist._id === checklistId)
        if (-1 !== checklistIndex) {
            const itemIndex = newCardInfos.checklists[checklistIndex].items.findIndex(item => item._id === newItem._id)
            if (-1 !== itemIndex) {
                newCardInfos.checklists[checklistIndex].items[itemIndex] = newItem
                this.setState({
                    cardInfos: newCardInfos
                })
            }
        }
    }

    handleItemDelete(e, itemId, checklistId){
        e.stopPropagation()
        this.onClickDeleteItem(itemId, checklistId)
    }

    onClickDeleteItem(itemId, checklistId) {
        const checklistIndex = this.state.cardInfos.checklists.findIndex(oldChecklist => oldChecklist._id === checklistId)
        if (-1 !== checklistIndex) {
            axios.delete(url.api + 'item/' + itemId + "/checklist/" + checklistId + '/card/' + this.state.cardInfos._id, url.config)
            .then((response) => {
                this.deleteItem(itemId, checklistId)
                this.socket.emit('deleteItemServer', itemId, checklistId)
            })
            .catch((error) => {
                alert('An error occured when updating the checklist title')
            })
        }
    }

    deleteItem(itemId, checklistId) {
        let newCardInfos = this.state.cardInfos
        const checklistIndex = newCardInfos.checklists.findIndex(checklist => checklist._id === checklistId)
        if (-1 !== checklistIndex) {
            const items = newCardInfos.checklists[checklistIndex].items.filter(item => item._id !== itemId)
            newCardInfos.checklists[checklistIndex].items = items
            this.setState({
                cardInfos: newCardInfos
            })
            this.state.card.setState({
                cardInfos: newCardInfos
            })
        }
    }
}

export default Popup
