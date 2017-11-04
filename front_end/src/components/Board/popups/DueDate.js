import React from 'react'
import Datetime from 'react-datetime'

class DueDate extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dueDate: this.props.dueDate,
            date: new Date().toISOString(),
            previousDate: null,
            minDate: null,
            maxDate: null,
            focused: false,
            invalid: false
        }
    }
    
    render(){
        
        return(
            <div className="dueDate">
                <hr/>
                <Datetime />
            </div>
        )
    }

}

export default DueDate
