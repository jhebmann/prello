import React from 'react'
import { Glyphicon, Thumbnail } from 'react-bootstrap'
import SkyLight from 'react-skylight'
import Popup from './Popup.js'
import moment from 'moment'
import Draggable from 'react-draggable';
import axios from 'axios'
import url from '../../config'

class Card extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cardInfos: this.props.cardInfos,
            listTitle: this.props.listTitle,
            attachments: []
        }

        this.socket = this.props.io
        this.updateCard = this.updateCard.bind(this)
        this.loadAttachments = this.loadAttachments.bind(this)

        //Event Listeners
        this.socket.on('updateCardClient', this.updateCard)

        this.loadAttachments()
    }

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
            <span className={dueDateClass.join("")+" dueDateColors inlineElements"}><Glyphicon glyph='time' className='myGlyph'/> {moment(this.state.cardInfos.dueDate).format('DD MMM')}</span> : ''}</div>
        
        return(
            <div>
                <Draggable>
                <div>{(this.state.cardInfos.labels && this.state.cardInfos.labels.length > 0) ? <div>{this.state.cardInfos.labels.length} labels</div> : ''}
                    <Thumbnail onClick={() => this.customDialog.show()} className='card' >
                        <div></div>
                        <h4>{this.state.cardInfos.title}</h4>
                        {(this.state.cardInfos.description || this.state.cardInfos.comments.length > 0 || this.state.cardInfos.dueDate) ?
                        <div>
                            {dueDateDiv}
                            <div className="alignElements"><p> {(this.state.cardInfos.description) ? <Glyphicon glyph='align-left'/> : ''} </p></div>
                            <div>{(this.state.cardInfos.comments && this.state.cardInfos.comments.length > 0) ? <div><Glyphicon glyph='comment'/>{this.state.cardInfos.comments.length}</div> : ''}</div>
                        </div> :""}
                    </Thumbnail>
                </div>
                </Draggable>
               
                <SkyLight dialogStyles = {bigPopup} hideOnOverlayClicked ref = {ref => this.customDialog = ref}>
                    <Popup listTitle = {this.state.listTitle} card = {this} cardInfos = {this.state.cardInfos} attachments = {this.state.attachments} io={this.socket}/>
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

    loadAttachments(){
        if (this.state.cardInfos.attachments) {
            this.state.cardInfos.attachments.forEach((attachment) => {
                axios.get(url.api + 'attachment/' + attachment._id)
                .then((response) => {
                    this.setState(prevState=>({
                        attachments: prevState.attachments.concat({
                            image: response.data,
                            title: attachment.title,
                            postedBy: attachment.postedBy
                        })
                      }))
                }).catch((error) => {
                    alert('An error occured when adding the attachment')
                })
            })
        }
    }
}

export default Card