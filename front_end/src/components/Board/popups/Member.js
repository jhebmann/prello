import React from 'react'


class Member extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="member">
                <hr/>
                
            </div>
        )
    }

}

export default Member
