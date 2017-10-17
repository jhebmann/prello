import React from 'react';
import {Button,Panel,FormControl} from 'react-bootstrap';
import Card from './Card.js';

class List extends React.Component{

  constructor(props){
    super(props);    
    //Default State
    this.state={
      id:this.props.id,
      cards: [],
      titleNewCard: null
    }
    
    this.socket = this.props.io;
    this.handleCarTitleImputChange = this.handleCarTitleImputChange.bind(this);
    this.onClickAddCard = this.onClickAddCard.bind(this);
    this.addCard = this.addCard.bind(this);
    this.changeList = this.changeList.bind(this);
    this.onClickDeleteList= this.onClickDeleteList.bind(this)

    //Event Listeners
    this.socket.on('newCard', this.addCard);
    this.socket.on('changeList',this.changeList);
  }

  componentDidMount() {
    this.setState({cards:this.props.cards});
  }

  render(){
    return(
      <Panel bsSize="small" style={{display: "inline-flex", background: "lightgray",margin:"20px"}}>
        <h4>{this.props.titleList}</h4>
        {this.cardList(this.state.cards)} 
        <p><FormControl type="text" onChange={this.handleCarTitleImputChange} placeholder="Card Title" />
        <Button bsStyle="success" onClick={this.onClickAddCard}>Add Card</Button>
        <Button bsStyle="danger" onClick={this.onClickDeleteList}>Delete Cards</Button></p>
    </Panel>
      );
  } 

  addCard(card,id){
    if(id === this.state.id){
      console.log(id,this.state.id)
      this.setState(prevState=>({
        cards: prevState.cards.concat({
          titleCard: card.titleCard,
          description: card.description,
          date: card.date
        })
      }));
    }
  }

  //Handle Card title imput
  handleCarTitleImputChange(e) {  
    this.setState({titleNewCard: e.target.value});
  }

  onClickAddCard(b){
    const newCard={
      titleCard: this.state.titleNewCard,
      date: Date.now()
    }
    this.setState(prevState=>({
      cards: prevState.cards.concat(newCard)
    }));
    this.socket.emit('newCardClient',newCard,this.state.id);
  }

  //Renders the Cards stored in the cards array   
  cardList(list){
    const cards=this.state.cards;
    const cardItems= cards.map((card, index)=>
      <Card key={index} titleCard={card.titleCard} description={card.description} date={card.date}/>
    );
    return cardItems
  }

  onClickDeleteList(){
    this.socket.emit('deleteList',this.state.id);
     this.setState({cards:[]});
  }

  changeList(list,id){
    console.log("Id list param",id,"Id list state",this.state.id)
    if(id===this.state.id)
      this.setState({cards:[]});
  }

}

export default List;