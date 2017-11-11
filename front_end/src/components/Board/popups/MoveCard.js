import React from 'react'


class MoveCard extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="moveCard">
                <hr className="skylightHr"/>
                
            </div>
        )
    }

}

export default MoveCard
