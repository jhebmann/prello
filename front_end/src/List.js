import React from 'react';
import {Button,Panel,FormControl} from 'react-bootstrap';
import Card from './Card.js';

class List extends React.Component{

  constructor(props){
    super(props);    
    //Default State
    this.state={
      id_list:this.props.id_list,
      cards: [],
      title_new_card: null
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
        <h4>{this.props.title_list}</h4>
        {this.cardList(this.state.cards)} 
        <p><FormControl type="text" onChange={this.handleCarTitleImputChange} placeholder="Card Title" />
        <Button bsStyle="success" onClick={this.onClickAddCard}>Add Card</Button>
        <Button bsStyle="danger" onClick={this.onClickDeleteList}>Delete Cards</Button></p>
    </Panel>
      );
  } 

  addCard(card,id_list){
    if(id_list == this.state.id_list){
      this.setState(prevState=>({
        cards: prevState.cards.concat({
          title_card: card.title_card,
          description: card.description,
          date: card.date
        })
      }));
    }
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
    this.socket.emit('newCardClient',new_card,this.state.id_list);
  }

  //Renders the Cards stored in the cards array   
  cardList(list){
    const cards=this.state.cards;
    const cardItems= cards.map((card)=>
      <Card title_card={card.title_card} description={card.description} date={card.date}/>
    );
    return cardItems
  }

  onClickDeleteList(){
    this.socket.emit('deleteList',this.state.id_list);
     this.setState({cards:[]});
  }

  changeList(list,id_list){
    console.log("Id list param",id_list,"Id list state",this.state.id_list)
    if(id_list==this.state.id_list)
      this.setState({cards:[]});
  }

}

export default List;