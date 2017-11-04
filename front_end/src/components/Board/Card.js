import React from 'react'
import { Thumbnail, ProgressBar } from 'react-bootstrap'
import SkyLight from 'react-skylight'
import Popup from './Popup.js'


class Card extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            title: this.props.title ? this.props.title : undefined,
            description: this.props.description ? this.props.description : undefined,
            dueDate: this.props.date ? this.props.date : undefined,
            doneDate: this.props.doneDate ? this.props.doneDate : undefined,
            labels: this.props.labels ? this.props.labels : undefined,
            listTitle: this.props.listTitle ? this.props.listTitle : undefined
        }

        this.socket = this.props.io
        this.updateCard = this.updateCard.bind(this)

        //Event Listeners
        this.socket.on('updateCardClient', this.updateCard)
    }

    render(){

        const bigPopup = {
            width: '60%',
            height: '100%',
            marginTop: '-19%',
            marginLeft: '-30%',
            overflow: 'hidden',
            overflowY: 'auto',
            backgroundColor: '#EDEFF0'
        }
        
        return(
            <div>
                <Thumbnail onClick={() => this.customDialog.show()} className='card' >
                    <ProgressBar bsStyle="danger" now={100} />
                    <h4>{this.state.title}</h4>
                    <p> {this.state.description} </p>
                </Thumbnail>
                
                <SkyLight dialogStyles = {bigPopup} hideOnOverlayClicked ref = {ref => this.customDialog = ref} title={this.state.title}>
                    <Popup listTitle = {this.state.listTitle} card = {this} cardId = {this.props.cardId} title = {this.state.title}
                            description = {this.state.description} dueDate = {this.state.dueDate} doneDate = {this.state.doneDate} 
                            isArchived = {false} members = {[]} labels = {[]} checklists = {[]} comments = {[]} activities = {[]} 
                            io={this.socket}/>
                </SkyLight>
            </div>
            
        )
    }

    updateCard(card){
        if (card._id === this.props.cardId){
            this.setState({
                title: card.title,
                description: card.description,
                dueDate: card.dueDate,
                doneDate: card.doneDate,
                isArchived: card.isArchived
            })
        }
    }
}

export default Card