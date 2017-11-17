import React from 'react'
import { Glyphicon, Thumbnail } from 'react-bootstrap'
import SkyLight from 'react-skylight'
import Popup from './Popup.js'
import moment from 'moment'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'
import url from '../../config'
import 'react-confirm-alert/src/react-confirm-alert.css'
import handleServerResponse from '../../response'

class Card extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cardInfos: this.props.cardInfos,
            listTitle: this.props.listTitle,
            attachments: [],
            parameters: this.props.parameters
        }

        this.socket = this.props.io
        this.updateCard = this.updateCard.bind(this)
        this.loadAttachments = this.loadAttachments.bind(this)
        this.onClickDeleteCard = this.onClickDeleteCard.bind(this)

        //Event Listeners
        this.socket.on('updateCardClient', this.updateCard)
        
        this.loadAttachments()
    }
    /*
    componentDidMount(){
        if (this.state.cardInfos._id === this.state.parameters.cardToFocus){
            this.customDialog.show()
        }
    }
*/
    render(){

        const bigPopup = {
            width: '60%',
            height: '85%',
            marginTop: '5px',
            marginLeft: '-30%',
            overflow: 'auto',
            backgroundColor: '#EDEFF0',
            top:"70px"
        }
        
        let dueDateClass = ["dueDateType"]
        const dueDate = new Date(this.state.cardInfos.dueDate)
        const today = new Date()
        
        if (this.state.cardInfos.doneDate) {
            dueDateClass.push("Done")
        }
        else if ( dueDate < today){
            dueDateClass.push("Late")
        }
        else if ((Math.abs(dueDate - today) / 36e5) < 72) {
            dueDateClass.push("Warning")
        }

        const dueDateDiv = <div className="alignElements">{(this.state.cardInfos.dueDate) ? 
            <span className={dueDateClass.join("")+" dueDateColors inlineElementsCard"}><Glyphicon glyph='time' className='myGlyph'/> {moment(this.state.cardInfos.dueDate).format('DD MMM')}</span> : ''}</div>
        
        const items = this.state.cardInfos.checklists.map((checklist) => checklist.items).reduce((a, b) => a.concat(b), [])
        const numItems = items.length
        const numDoneItems = items.filter((item) => item.isDone).length

        return(
            <div>
                <div>
                    <Thumbnail onClick={() => this.customDialog.show()}
                        className={('undefined' !== typeof this.state.parameters && this.state.cardInfos._id === this.state.parameters.cardId) ? "selected card" : "card"}
                    >
                        {(this.state.cardInfos.labels && this.state.cardInfos.labels.length > 0) && 
                            <div>{this.state.cardInfos.labels.length} labels</div>
                        }
                        <div className="glyphRemoveCard" onClick={this.onClickDeleteCard}><Glyphicon glyph='remove' className="glyphRemoveCardChild"/></div>
                        <h4>{this.state.cardInfos.title}</h4>
                        {(this.state.cardInfos.description || this.state.cardInfos.comments.length > 0 || this.state.cardInfos.dueDate) &&
                            <div>
                                {dueDateDiv}
                                <div className="alignElements"><p> {(this.state.cardInfos.description) && <Glyphicon glyph='align-left'/>} </p></div>
                                <div>{(this.state.cardInfos.comments && this.state.cardInfos.comments.length > 0) ? <div><Glyphicon glyph='comment'/>{this.state.cardInfos.comments.length}</div> : ''}</div>
                            </div>
                        }
                        {(numItems > 0) &&
                            <div>
                                <div><Glyphicon glyph='check'/>{numDoneItems + "/" + numItems}</div>
                            </div>
                        }
                    </Thumbnail>
                </div>
               
                <SkyLight dialogStyles = {bigPopup} hideOnOverlayClicked ref = {ref => this.customDialog = ref}>
                    <Popup listTitle = {this.state.listTitle} card = {this} cardInfos = {this.state.cardInfos} attachments = {this.state.attachments} io={this.socket}
                            listId = {this.props.listId} boardId = {this.props.boardId} parentClose={this.handlePopupClose.bind(this)} usersBoard={this.props.usersBoard}
                            dropbox={this.props.dropbox}
                    />
                </SkyLight>
            </div>
        )
    }

    updateCard(card){
        if (card._id === this.state.cardInfos._id){
            this.setState({
                "cardInfos.title": card.title,
                "cardInfos.description": card.description,
                "cardInfos.dueDate": card.dueDate,
                "cardInfos.doneDate": card.doneDate,
                "cardInfos.isArchived": card.isArchived
            })
        }
    }

    handlePopupClose(namePopupToHide){
        if ("popup" === namePopupToHide) this.addMember.hide()
    }

    loadAttachments(){
        if (this.state.cardInfos.attachments) {
            this.state.cardInfos.attachments.forEach((attachment) => {
                axios.get(url.api + 'attachment/' + attachment._id, url.config)
                .then((response) => {
                    this.setState(prevState=>({
                        attachments: prevState.attachments.concat({
                            image: response.data,
                            title: attachment.title,
                            postedBy: attachment.postedBy,
                            _id: attachment._id,
                            datePost: attachment.datePost
                        }).sort((a, b) => a.datePost < b.datePost)
                      }))
                }).catch((error) => {
                    handleServerResponse(error, 'An error occured when adding the attachment')
                })
            })
        }
    }

    onClickDeleteCard(e){
        e.stopPropagation()
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
                    handleServerResponse(error, 'An error occured when deleting the card')
                })
            )
        })
    }
}

export default Card