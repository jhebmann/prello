import React from 'react'
import {Button, Panel, FormControl} from 'react-bootstrap'
import axios from 'axios'
import Card from './Card.js'
import url from '../../config'

class List extends React.Component{

  constructor(props){
    super(props)
    //Default State
    this.state={
      cards: [],
      titleNewCard: "",
      showInput: false,
      title: this.props.title,
      pos: this.props.pos // always undefined for now
    }
    
    this.socket = this.props.io
    this.onClickAddCard = this.onClickAddCard.bind(this)
    this.addCard = this.addCard.bind(this)
    this.deleteCards = this.deleteCards.bind(this)
    this.onClickDeleteList= this.onClickDeleteList.bind(this)
    this.getAllCards= this.getAllCards.bind(this)
    this.onClickUpdateList = this.onClickUpdateList.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.updateListTitle = this.updateListTitle.bind(this)

    //Event Listeners
    this.socket.on('updateListTitle', this.updateListTitle)
    this.socket.on('addCard', this.addCard)
    this.socket.on('deleteCards', this.deleteCards)

  }

  componentDidMount() {
    // console.dir(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard + '/cards')
    axios.get(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard + '/cards')
    .then((response) => {
      this.getAllCards(response.data, this.props.id)
    })
    .catch((error) => {
      alert('An error occured when getting the cards')
    })
  }

  render(){
      let headList  = null
      if(!this.state.showInput) {
        headList = <h4 onClick={this.onClickUpdateList} className='listTitle'>{this.state.title || 'Undefined'}</h4>
      } else{
        headList = <input autoFocus='true' onChange={this.handleInputChange} onBlur={this.onClickUpdateList} 
                          type="text" name="title" value={this.state.title} onKeyPress={this.handleKeyPress}/>
      }
      return(
        <Panel bsSize="small" className='list'>
          <div className='listHead'>
            {headList}
          </div>
          <div className="listBody">
            {this.cardList(this.state.cards)} 
            <p>
              <FormControl type="text" onChange={this.handleInputChange} placeholder="Card Title" name="titleNewCard" 
                            value={this.state.titleNewCard} onKeyPress={this.handleKeyPress}/>
              <Button className='cardButton' bsStyle="success" onClick={this.onClickAddCard}>Add Card</Button>
              <Button className='cardButton' bsStyle="danger" onClick={this.onClickDeleteList}>Delete Cards</Button>
            </p>
          </div>
        </Panel>
      )
  } 

  //Renders the Cards stored in the cards array   
  cardList(list){
    const cards=this.state.cards
    const cardItems= cards.map((card, index)=>
      <Card listTitle={this.state.title} key={index} title={card.title} description={card.description} date={card.date}/>
    )
    return cardItems
  }

  getAllCards(cards, id){
    if(id === this.props.id){
      cards.sort(function(a, b){ return a.pos - b.pos})
      this.setState({cards: cards})
    }
  }

  addCard(card, id){
    if(id === this.props.id){
      this.setState(prevState=>({
        cards: prevState.cards.concat({
          title: card.title,
          description: card.description,
          date: card.date
        })
      }))
    }
  }

  handleInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if ("title" === e.target.name) this.onClickUpdateList()
      else if ("titleNewCard" === e.target.name) this.onClickAddCard()
    }
  }

  onClickUpdateList() {
    if (this.state.showInput){
      axios.put(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard, {
        title: this.state.title,
        pos : this.state.pos
      }).then((response) => {
        this.socket.emit('updateListTitle', response.data._id, this.state.title)
        this.updateListTitle(response.data._id, this.state.title)
      })
      .catch((error) => {
        alert('An error occured when updating the list')
      })
    }
    this.setState({showInput: !this.state.showInput})
  }

  updateListTitle(id, title){
    if(id === this.props.id){
      this.setState({title: title})
    }
  }

  onClickAddCard(){
    axios.post(url.api + 'card/board/' + this.props.idBoard + '/list/' + this.props.id, {
      title: this.state.titleNewCard,
      pos: this.state.cards.length
    }).then((response) => {
      this.socket.emit('newCard', response.data, this.props.id)
      this.addCard(response.data, this.props.id)
      this.setState({titleNewCard : ""})
    })
    .catch((error) => {
      alert('An error occured when adding the card')
    })
  }

  onClickDeleteList(){
    axios.delete(url.api + 'card/list/' + this.props.id + '/board/' + this.props.idBoard)
    .then((response) => {
      this.deleteCards(this.props.id)
      this.socket.emit('deleteAllCards', this.props.id)
    })
    .catch((error) => {
      alert('An error occured when deleting the list')
    })
  }

  deleteCards(idList){
    if(idList === this.props.id)
      this.setState({cards:[]})
  }

}

export default List