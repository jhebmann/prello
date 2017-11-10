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
            popup: this.props.popup,
            card: this.props.card,
            dueDate: this.roundMinutes(new Date())
        }

        this.socket = this.props.io
        this.onClickUpdateDueDate = this.onClickUpdateDueDate.bind(this)
        this.updateCard = this.updateCard.bind(this)
    }

    roundMinutes(date) {
        
        date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
        date.setMinutes(0);
    
        return date;
    }
    
    render(){
        const timeCons = {minutes: {step: 1}}
        const yesterday = DateTime.moment().subtract( 1, 'day' )
        const valid = function( current ){
            return current.isAfter( yesterday )
        };
        return(
            <div className="dueDate">
                <hr/>
                <div id="dueDateInput">
                    <DateTime
                        value={this.state.dueDate}
                        className="inputDateTime"
                        onChange={param => { this.setState({dueDate: param._d})} }
                        viewMode= 'days'
                        dateFormat= 'M/D'
                        timeFormat= 'HH:mm'
                        input= {true}
                        utc= {false}
                        timeConstraints= {timeCons}
                        isValidDate={valid}
                    />
                    <Button disabled={undefined === this.state.dueDate || this.state.dueDate < new Date()} className='dueDateButton' bsStyle="primary" onClick={this.onClickUpdateDueDate}>Add</Button>
                </div>
            </div>
        )
    }

    onClickUpdateDueDate = (e) => {
        axios.put(url.api + 'card/' + this.props.card.state.cardInfos._id, {
            dueDate : this.state.dueDate,
            doneDate : null
        }, url.config).then((response) => {
            this.socket.emit('updateCardServer', response.data)
            this.updateCard(response.data)
        })
        .catch((error) => {
            alert('An error occured when updating the list')
        })
    }

    updateCard(card){
        if (card._id === this.props.card.state.cardInfos._id){
            let newCardInfos = this.state.card.state.cardInfos
            newCardInfos.dueDate = this.state.dueDate
            this.state.card.setState({cardInfos: newCardInfos})
            this.state.popup.setState({cardInfos: newCardInfos})
            this.setState({dueDate: this.roundMinutes(new Date())})
            this.props.parentClose("dueDate")
        }
    }

}

export default DueDate
