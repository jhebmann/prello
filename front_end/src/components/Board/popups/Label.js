import React from 'react'
import axios from 'axios'
import url from '../../../config'
import handleServerResponse from '../../../response'


class Label extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            labels: this.props.labels,
            labelsBoard: this.props.labelsBoard
        }

        this.socket = this.props.io
    }


    componentWillReceiveProps(newProps) {
        this.setState({labels: newProps.labels})
    }

    render(){
        return(
            <div className="label">
                <hr className="skylightHr"/>
                {this.allLabels()}
            </div>
        )
    }

    allLabels(){
        let labels = []

        this.state.labelsBoard.forEach((label) => {
            if (this.state.labels.indexOf(label) === -1){
                //Label not in the card
                labels.push(
                    <div id={label._id} key={label._id} className="labelShow" style={{"backgroundColor": label.color}} onClick={() => this.addLabel(label)}>{label.title}</div>
                )
            } else {
                labels.push(
                    <div id={label._id} key={label._id} className="labelShow selectedLabel" style={{"backgroundColor": label.color}} onClick={() => this.removeLabel(label)}>{label.title}</div>
                )
            }
        })

        return labels
    }

    addLabel(label){
        let labels = this.state.labels
        labels.push(label)
        this.setState({
            labels: labels
        })

        axios.put(url.api + 'card/' + this.props.card.state.cardInfos._id + "/label/add/" + label._id, {}, url.config)
        .then((response) => {
            this.socket.emit('updateCardServer', response.data)
            this.updateCard()
        })
        .catch((error) => {
            handleServerResponse(error, 'An error occured when updating the labels')
        })
    }

    removeLabel(label){
        const index = this.state.labels.indexOf(label)
        let labels = this.state.labels
        if (index !== -1){
            labels.splice(index, 1)
            this.setState({
                labels: labels
            })

            axios.put(url.api + 'card/' + this.props.card.state.cardInfos._id + "/label/remove/" + label._id, {}, url.config)
            .then((response) => {
                this.socket.emit('updateCardServer', response.data)
                this.updateCard()
            })
            .catch((error) => {
                handleServerResponse(error, 'An error occured when updating the labels')
            })
        }
    }

    updateCard(){
        let newCardInfos = this.state.card.state.cardInfos
        newCardInfos.labels = this.state.labels.map((label) => label._id)
        this.state.card.setState({cardInfos: newCardInfos})
        this.state.popup.setState({cardInfos: newCardInfos})
    }

}

export default Label
