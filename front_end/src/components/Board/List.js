import React from 'react'
import {Button, FormControl, Glyphicon, Panel} from 'react-bootstrap'
import axios from 'axios'
import Card from './Card.js'
import url from '../../config'
import handleServerResponse from '../../response'
import { confirmAlert } from 'react-confirm-alert'

class List extends React.Component{

  constructor(props){
    super(props)
    //Default State
    this.state = {
      cards: [],
      titleNewCard: "",
      showInput: false,
      title: this.props.title,
      pos: this.props.pos, // always undefined for now
      parameters: this.props.parameters
    }

    this.socket = this.props.io

    this.onClickAddCard = this.onClickAddCard.bind(this)
    this.onClickDeleteCards= this.onClickDeleteCards.bind(this)
    this.onClickUpdateList = this.onClickUpdateList.bind(this)
    this.onClickDeleteList = this.onClickDeleteList.bind(this)

    this.addCard = this.addCard.bind(this)
    this.deleteCards = this.deleteCards.bind(this)
    this.getAllCards= this.getAllCards.bind(this)
    this.updateListTitle = this.updateListTitle.bind(this)
    this.deleteCard = this.deleteCard.bind(this)

    this.handleInputChange = this.handleInputChange.bind(this)

    //Event Listeners
    this.socket.on('updateListTitle', this.updateListTitle)
    this.socket.on('addCard', this.addCard)
    this.socket.on('deleteCards', this.deleteCards)
    this.socket.on('deleteCardClient', this.deleteCard)

  }

  componentDidMount() {
    axios.get(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard + '/cards', url.config)
    .then((response) => {
      this.getAllCards(response.data, this.props.id)
    })
    .catch((error) => {
      handleServerResponse(error, 'An error occured when getting the cards')
    })
  }

  render(){
      let headList  = null
      if(!this.state.showInput) {
        headList = <h4 onClick={this.onClickUpdateList} className='listTitle'>{this.state.title || 'No title'}</h4>
      } else{
        headList = <input autoFocus='true' onChange={this.handleInputChange} onBlur={this.onClickUpdateList}
                          type="text" name="title" value={this.state.title} onKeyPress={this.handleKeyPress}/>
      }
      return(
        <Panel bsSize="small" className={('undefined' !== typeof this.state.parameters.state && this.props.id === this.state.parameters.state.listId) ? "selected list" : "list"}>
          <div className='listHead'>
            <div className="titleListDiv">
              {headList}
              <div className="glyphRemoveList" onClick={this.onClickDeleteList}>
                <Glyphicon glyph='remove' className="glyphRemoveListChild"/>
              </div>
            </div>
          </div>
          <div className="listBody">
                    {this.cardList()}
            <p>
              <FormControl type="text" onChange={this.handleInputChange} placeholder="Card Title" name="titleNewCard"
                            value={this.state.titleNewCard} onKeyPress={this.handleKeyPress}/>
              <Button className='cardButton' bsStyle="success" onClick={this.onClickAddCard} disabled={this.state.titleNewCard.trim().length < 1}>Add Card</Button>
              <Button className='cardButton' bsStyle="danger" onClick={this.onClickDeleteCards} disabled={this.state.cards.length < 1}>Delete Cards</Button>
            </p>
          </div>
        </Panel>
      )
  }

  //Renders the Cards stored in the cards array
  cardList(){
    const cardItems= this.state.cards.map((card) =>
            <Card parameters = {this.state.parameters} boardId={this.props.idBoard} listTitle={this.state.title}
                listId = {this.props.id} key={card._id} cardInfos={card} io={this.socket}
                usersBoard={this.props.usersBoard} dbx={this.props.dbx} labelsBoard={this.props.labelsBoard}
              />
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
          _id: card._id,
          title: card.title,
          description: card.description,
          date: card.date,
          checklists: [],
          labels: [],
          comments: [],
          users:[]
        })
      }))
    }
  }

  handleInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if ("title" === e.target.name) {
        this.onClickUpdateList()
      }
      else if ("titleNewCard" === e.target.name) {
        if (this.state.titleNewCard.trim().length > 0) {
          this.onClickAddCard()
        }
      }
    }
  }

  onClickUpdateList() {
    if (this.state.showInput){
      if (!this.state.title || this.state.title.trim().length < 1) {
        axios.get(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard, url.config)
        .then((response) => {
          this.socket.emit('updateListTitle', response.data._id, response.data.title)
          this.updateListTitle(response.data._id, response.data.title)
        })
        .catch((error) => {
          handleServerResponse(error, 'An error occured when updating the list')
        })
      }
      else {
        axios.put(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard, {
          title: this.state.title.trim(),
          pos : this.state.pos
        }, url.config).then((response) => {
          this.socket.emit('updateListTitle', response.data._id, response.data.title)
          this.updateListTitle(response.data._id, response.data.title)
        })
        .catch((error) => {
          handleServerResponse(error, 'An error occured when updating the list')
        })
      }
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
      title: this.state.titleNewCard.trim(),
      pos: this.state.cards.length
    }, url.config).then((response) => {
      this.socket.emit('newCard', response.data, this.props.id)
      this.addCard(response.data, this.props.id)
      this.setState({titleNewCard : ""})
    })
    .catch((error) => {
      handleServerResponse(error, 'An error occured when adding the card')
    })
  }

  onClickDeleteCards() {
    confirmAlert({
      title: 'Delete all cards in ' + this.props.title + '?',
      message: 'All cards in this list will be removed and you won\'t be able to re-open it. There is no undo !',
      confirmLabel: 'Delete',                           // Text button confirm
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => (
        axios.delete(url.api + 'card/list/' + this.props.id + '/board/' + this.props.idBoard, url.config)
        .then((response) => {
          this.deleteCards(this.props.id)
          this.socket.emit('deleteAllCards', this.props.id)
        })
        .catch((error) => {
          handleServerResponse(error, 'An error occured when deleting the cards')
        })
      )
  })
  }





  onClickDeleteList() {
    confirmAlert({
      title: 'Delete the list ' + this.props.title + '?',
      message: 'This list will be removed and you won\'t be able to re-open it. There is no undo !',
      confirmLabel: 'Delete',                           // Text button confirm
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => (
        axios.delete(url.api + 'list/' + this.props.id + '/board/' + this.props.idBoard, url.config)
        .then((response) => {
          this.socket.emit('deleteListServer', this.props.id)
        })
        .catch((error) => {
          handleServerResponse(error, 'An error occured when deleting the list')
        })
      )
  })
  }

  deleteCards(idList) {
    if(idList === this.props.id)
      this.setState({cards:[]})
  }

  deleteCard(cardId) {
    this.setState( prevState => ({
      cards: prevState.cards.filter(card => card._id !== cardId)
    }))
  }

}

export default List