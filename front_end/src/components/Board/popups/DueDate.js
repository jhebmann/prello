import React from 'react'
import {Button} from 'react-bootstrap'
import DateTime from 'react-datetime'

import './reactDateTime.css'

class DueDate extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dueDate: this.props.dueDate
        }
        this.onClickUpdateDueDate = this.onClickUpdateDueDate.bind(this)
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
        alert(this.state.dueDate)
    }

}

export default DueDate
