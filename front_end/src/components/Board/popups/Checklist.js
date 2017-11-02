import React from 'react'
import { Button } from 'react-bootstrap'


class Checklist extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="checklist">
                
            </div>
        )
    }

}

export default Checklist
