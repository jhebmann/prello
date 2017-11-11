import React from 'react'


class Attachment extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            attachments: this.props.attachments,
            attachment: undefined
        }
    }

    render(){
        
        return(
            <div className="attachment">
                <hr className="skylightHr"/>
                
            </div>
        )
    }

}

export default Attachment
