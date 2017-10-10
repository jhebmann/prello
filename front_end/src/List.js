import React from 'react';
import {Button,Panel,FormControl} from 'react-bootstrap';
import Card from './Card.js';

class List extends React.Component{

  constructor(props){
    super(props);    
    //Default State
    this.state={
      cards: [],
      title_new_card: null
    }
    
    this.socket = this.props.io;
    this.initialize = this.initialize.bind(this);
    this.handleCarTitleImputChange = this.handleCarTitleImputChange.bind(this);
    this.onClickAddCard = this.onClickAddCard.bind(this);
    this.addCard = this.addCard.bind(this);
    
    //Event Listeners
    this.socket.on('newCard', this.addCard);
    this.socket.on('initialize', this.initialize);  //We should use componentDidMount() ?
  }

  render(){
    return(
      <Panel bsSize="small" style={{display: "inline-flex", background: "lightgray",margin:"20px"}}>
        {this.cardList(this.state.cards)} 
        <p><FormControl type="text" onChange={this.handleCarTitleImputChange} placeholder="Card Title" />
        <Button bsStyle="primary" onClick={this.onClickAddCard}>Add empty Card</Button></p>
    </Panel>
      );
  } 
  
  //Gets the array from server with all the cards
  initialize(data){
    data.map((card)=>
      this.addCard(card)
    );
  }

  addCard(card){
    this.setState(prevState=>({
      cards: prevState.cards.concat({
        title_card: card.title_card,
        description: card.description,
        date: card.date
      })
    }));
  }

  //Handle Card title imput
  handleCarTitleImputChange(e) {  
    this.setState({title_new_card: e.target.value});
  }

  onClickAddCard(b){
    const new_card={
      title_card: this.state.title_new_card,
      date: Date.now()
    }
    this.setState(prevState=>({
      cards: prevState.cards.concat(new_card)
    }));
    this.socket.emit('newCardClient',new_card);
  }

  //Renders the Cards stored in the cards array   
  cardList(list){
    const cards=this.state.cards;
    const cardItems= cards.map((card)=>
      <Card title_card={card.title_card} description={card.description} date={card.date}/>
    );
    return cardItems
  }

}

export default List;