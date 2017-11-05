import React from 'react'


class Attachment extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
    }

    render(){
        
        return(
            <div className="attachment">
                <hr/>
                
            </div>
        )
    }

}

export default Attachment
