import React from 'react'
import CascadeMemberCard from '../CascadeMemberCard.js'

class Member extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card
        }
        this.socket=this.props.io
        this.updateCard=this.updateCard.bind(this)
    }

    render(){
        return(
            <div className="member">
                <hr className="skylightHr"/>
                <CascadeMemberCard members={this.props.usersBoard.filter(usr=>!this.state.card.state.cardInfos.users.includes(usr._id))} remove={false} card={this.state.card.state.cardInfos} callback={this.updateCard} />
                <CascadeMemberCard members={this.props.usersBoard.filter(usr=>this.state.card.state.cardInfos.users.includes(usr._id))} remove={true} card={this.state.card.state.cardInfos} callback={this.updateCard}/>
            </div>
        )
    }

    updateCard(card) {
        if (card._id ===this.state.card.state.cardInfos._id){
            let newCardInfos = this.state.card.state.cardInfos
            newCardInfos.users = card.users
            this.state.card.setState({cardInfos: newCardInfos})
            this.state.popup.setState({cardInfos: newCardInfos})
            this.props.parentClose("members")
        }
    }

}

export default Member
