import React from 'react'


class Label extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            labels: this.props.labels,
            labelsBoard: this.props.labelBoards
        }
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
