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
        console.log(this.state.card)
        return(
            <div className="member">
                <hr className="skylightHr"/>
                <CascadeMemberCard members={this.props.usersBoard.filter(usr=>!this.state.card.props.cardInfos.users.includes(usr._id))} usersBoard={this.props.usersBoard} remove={false} card={this.state.card.state.cardInfos} callback={this.updateCard} io={this.socket}/>
                <CascadeMemberCard members={this.props.usersBoard.filter(usr=>this.state.card.props.cardInfos.users.includes(usr._id))} remove={true} card={this.state.card.state.cardInfos} callback={this.updateCard} io={this.socket}/>
            </div>
        )
    }

    updateCard(card) {
        if (card._id ===this.state.card.props.cardInfos._id){
            let newCardInfos = this.state.card
            newCardInfos.state.cardInfos.users = card.users
            this.state.card.setState({card: newCardInfos})
            this.state.popup.setState({card: newCardInfos})
        }
    }

    componentWillReceiveProps(nextProps){
        let newCard=this.state.card
        newCard.cardInfos=nextProps.cardInfos
        this.setState({card: newCard})
      }
}

export default Member
