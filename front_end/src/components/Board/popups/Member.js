import React from 'react'


class Member extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="member">
                <hr className="skylightHr"/>
                
            </div>
        )
    }

}

export default Member
