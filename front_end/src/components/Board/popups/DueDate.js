import React from 'react'
import {Button} from 'react-bootstrap'
import DateTime from 'react-datetime'
import axios from 'axios'
import url from '../../../config'
import moment from 'moment'
import handleServerResponse from '../../../response'

import './reactDateTime.css'

class DueDate extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            dueDate: (this.props.dueDate) ? moment(this.props.dueDate).format("M/D HH:mm") : undefined
        }

        this.socket = this.props.io
        this.onClickUpdateDueDate = this.onClickUpdateDueDate.bind(this)
        this.onClickDeleteDueDate = this.onClickDeleteDueDate.bind(this)
        this.updateCard = this.updateCard.bind(this)
    }

    render(){
        const timeCons = {minutes: {step: 30}}
        const yesterday = DateTime.moment().subtract( 1, 'day' )
        const valid = function( current ){
            return current.isAfter( yesterday )
        }
        return(
            <div className="dueDate">
                <hr className="skylightHr"/>
                <div id="dueDateInput">
                    <DateTime
                        value={this.state.dueDate}
                        id="inputDateTime"
                        onChange={param => { this.setState({dueDate: param._d})} }
                        viewMode= 'days'
                        dateFormat= 'M/D'
                        timeFormat= 'HH:mm'
                        input= {true}
                        utc= {false}
                        timeConstraints= {timeCons}
                        isValidDate={valid}
                    />
                    <Button disabled={null === this.state.dueDate || undefined === this.state.dueDate || this.state.dueDate < new Date()} className='dueDateButton' bsStyle="primary" onClick={this.onClickUpdateDueDate}>Save</Button>
                    <Button disabled={undefined === this.state.popup.state.cardInfos.dueDate || null === this.state.popup.state.cardInfos.dueDate} className='removeDueDateButton' bsStyle="danger" onClick={this.onClickDeleteDueDate}>Remove</Button>
                </div>
            </div>
        )
    }

    onClickUpdateDueDate(e) {
        axios.put(url.api + 'card/' + this.props.card.state.cardInfos._id, {
            dueDate : ('boolean' === typeof e) ? null : this.state.dueDate,
            doneDate : null
        }, url.config).then((response) => {
            this.socket.emit('updateCardServer', response.data)
            this.updateCard(response.data)
        })
        .catch((error) => {
            handleServerResponse(error, 'An error occured when updating the list')
        })
    }

    onClickDeleteDueDate() {
        this.setState({dueDate: null})
        this.onClickUpdateDueDate(true)
    }

    updateCard(card) {
            let newCardInfos = this.state.card.state.cardInfos
            newCardInfos.dueDate = this.state.dueDate
            newCardInfos.doneDate = this.state.doneDate
            this.state.card.setState({cardInfos: newCardInfos})
            this.state.popup.setState({cardInfos: newCardInfos})
            this.props.parentClose("dueDate")
    }
}

export default DueDate
