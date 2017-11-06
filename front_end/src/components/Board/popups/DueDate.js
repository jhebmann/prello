import React from 'react'
import {Button} from 'react-bootstrap'
import DateTime from 'react-datetime'
import axios from 'axios'
import url from '../../../config'

import './reactDateTime.css'

class DueDate extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dueDate: this.props.dueDate
        }

        this.socket = this.props.io
        this.onClickUpdateDueDate = this.onClickUpdateDueDate.bind(this)
        this.updateCard = this.updateCard.bind(this)
    }
    
    render(){
        const timeCons = {minutes: {step: 30}}
        const yesterday = DateTime.moment().subtract( 1, 'day' )
        const valid = function( current ){
            return current.isAfter( yesterday )
        };
        return(
            <div className="dueDate">
                <hr/>
                <DateTime
                    value={this.state.dueDate}
                    className="inputDateTime"
                    onChange={param => { this.setState({dueDate: param._d})} }
                    viewMode= 'days'
                    dateFormat= 'LL'
                    timeFormat= 'HH:mm'
                    input= {true}
                    utc= {true}
                    timeConstraints= {timeCons}
                    isValidDate={valid}
                />
                <Button disabled={undefined === this.state.dueDate} className='dueDateButton' bsStyle="primary" onClick={this.onClickUpdateDueDate}>Add</Button>
            </div>
        )
    }

    onClickUpdateDueDate = (e) => {
        console.log(this.state.dueDate)
        axios.put(url.api + 'card/' + this.props.state.cardId, {
            dueDate : this.state.dueDate,
            doneDate : null
        }).then((response) => {
            console.log(this.props)
            this.socket.emit('updateCardServer', response.data)
            console.log('2')
            this.updateCard(response.data)
            console.log('3')
        })
        .catch((error) => {
            alert('An error occured when updating the list')
        })
    }

    updateCard(card){
        if (card._id === this.props.state.cardId){
            this.props.state.card.setState({
                title: card.title,
                description: card.description,
                dueDate: card.dueDate,
                doneDate: card.doneDate,
                isArchived: card.isArchived
            })
        }
    }

}

export default DueDate
