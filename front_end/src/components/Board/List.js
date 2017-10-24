import React from 'react';
import {Button,Panel,FormControl} from 'react-bootstrap';
import axios from 'axios'
import Card from './Card.js';

class List extends React.Component{

  constructor(props){
    super(props);    
    //Default State
    this.state={
      id: this.props.id,
      cards: [],
      titleNewCard: null,
      showInput: false,
      title: this.props.title,
      idBoard: this.props.idBoard,
      getApi: ''
    }
    
    this.socket = this.props.io;
    this.handleCardTitleInputChange = this.handleCardTitleInputChange.bind(this);
    this.onClickAddCard = this.onClickAddCard.bind(this);
    this.addCard = this.addCard.bind(this);
    this.deleteCards = this.deleteCards.bind(this);
    this.onClickDeleteList= this.onClickDeleteList.bind(this)
    this.getAllCards= this.getAllCards.bind(this)
    this.onClickEditTitle = this.onClickEditTitle.bind(this)
    this.handleTitleinput = this.handleTitleinput.bind(this)
    this.UpdateListTitle = this.UpdateListTitle.bind(this)

    this.socket.emit("getCards", this.state.id, this.state.idBoard)	

    //Event Listeners
    this.socket.on('UpdateListTitle', this.UpdateListTitle);
    this.socket.on('addEmptyCard', this.addCard);
    this.socket.on('deleteCards', this.deleteCards);
    this.socket.on('getAllCards', this.getAllCards);  //We should use componentDidMount() ?
  }

  handleTitleinput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value})
  }

  render(){
      let headList  = null;
      if(!this.state.showInput) {
        headList = <h3 onClick={this.onClickEditTitle} className='listTitle'>{this.state.title || 'Undefined'}</h3>
      } else{
        headList = <input autoFocus='true' onChange={this.handleTitleinput} onBlur={this.onClickEditTitle} type="text" name="title" value={this.state.title}/>
      }
      return(
        <Panel bsSize="small" className='list'>
          <div className='listHead'>
            {headList}
          </div>
          <div className="listBody">
            {this.cardList(this.state.cards)} 
            <p>
              <FormControl type="text" onChange={this.handleCardTitleInputChange} placeholder="Card Title" />
              <Button className='cardButton' bsStyle="success" onClick={this.onClickAddCard}>Add Card</Button>
              <Button className='cardButton' bsStyle="danger" onClick={this.onClickDeleteList}>Delete Cards</Button>
            </p>
          </div>
        </Panel>
      );
  } 

  getAllCards(cards, id){
    if(id === this.state.id){
      this.setState({cards: cards})
    }
  }

  addCard(card, id){
    if(id === this.state.id){
      this.setState(prevState=>({
        cards: prevState.cards.concat({
          titleCard: card.titleCard,
          description: card.description,
          date: card.date
        })
      }));
    }
  }

  UpdateListTitle(id, title){
    if(id === this.state.id){
      this.setState({title: title})
    }
  }

  onClickEditTitle(e) {
    if (this.state.showInput){
      //this.socket.emit('updateListTitle', this.state.idBoard, this.state.id, e.target.value)
      axios.put(`http://localhost:8000/api/list`, {
        boardId: this.state.idBoard,
        listId: this.state.id,
        newTitle: this.state.title
      }).then((response) => {
          console.log(response)
          this.setState({title: ''})
      })
      .catch((error) => {
      })
    }
    this.setState({showInput: !this.state.showInput})
  }

  //Handle Card title imput
  handleCardTitleInputChange(e) {  
    this.setState({titleNewCard: e.target.value});
  }

  onClickAddCard(b){
    console.log(this.state.titleNewCard + " " + this.state.id + " " + this.state.idBoard)
    this.socket.emit('newCardClient', this.state.titleNewCard, this.state.id, this.state.idBoard);
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
    console.log(this.state.id + this.state.idBoard)
    this.socket.emit('deleteAllCards', this.state.id, this.state.idBoard);
  }

  deleteCards(idList){
    if(idList === this.state.id)
      this.setState({cards:[]});
  }

}

export default List;