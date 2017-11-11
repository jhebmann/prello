import React from 'react'


class Label extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="label">
                <hr className="skylightHr"/>
                
            </div>
        )
    }

}

export default Label
