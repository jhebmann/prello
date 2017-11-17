import React from 'react'
import Auth from '../Auth/Auth.js'
import {Card,Tag,Button} from 'antd'
import axios from 'axios'
import url from '../../config'
import { confirmAlert } from 'react-confirm-alert'
import './home.css' 

class HomeUserBoard extends React.Component{

    constructor(props){
        super(props);
        this.state={
          board:this.props.board,
          titleNewBoard: '',
          showInput:false
        }
        this.socket = this.props.socket
        //Event Listeners
        
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onClickUpdateTitle = this.onClickUpdateTitle.bind(this)
        this.updateBoardTitle = this.updateBoardTitle.bind(this)
        this.onClickDeleteBoard = this.onClickDeleteBoard.bind(this)
        
        this.socket.on('updateBoardTitle', this.updateBoardTitle)
        
    }

    render(){
        let deleteBttn=''
        if(this.state.board.admins && this.state.board.admins.includes(Auth.getUserID()))
          deleteBttn=
          <Button type="danger"  icon="delete" size="small" onClick={(e) => {e.stopPropagation();this.onClickDeleteBoard(this.state.board._id)}}>Delete
          </Button> 
          return (
            <Card title={<div>{this.handleBoardTitle()}</div>} extra={deleteBttn}>
            <Tag color="red">Tag</Tag>
                <p>Description</p>
                {(this.state.board.isPublic) ?(
                  <p>Public Board</p>):(
                  <p>Private Board</p>)
                }
            </Card>
       )
    }

    handleBoardTitle(){
        let  headBoard = <h4>{this.state.board.title || 'No title'}</h4>
        if(this.state.board.admins && this.state.board.admins.includes(Auth.getUserID())){
            if(!this.state.showInput ) {
                headBoard = <span  onClick={(e) => {e.stopPropagation();this.onClickUpdateTitle();}}>{this.state.board.title || 'No title'}</span>
            } else{
                headBoard = <input className='inputBoardTitle' onClick={(e) => {e.stopPropagation()}} autoFocus='true' onChange={this.handleInputChange} onBlur={this.onClickUpdateTitle} 
                                type="text" name="title" value={this.state.titleNewBoard} onKeyPress={this.handleKeyPress}/>
            }
        }
        return headBoard
    }
    
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onClickUpdateTitle()
        }
      }
      
    onClickUpdateTitle(){
        let newBoard=this.state.board
        if(this.state.titleNewBoard!==''){
            newBoard.title=this.state.titleNewBoard
            this.makeRequest(this.state.titleNewBoard)
        }
        this.setState({showInput: !this.state.showInput,board:newBoard})

    }

    makeRequest(title){
        axios.put(url.api + 'board/' + this.state.board._id , {
            title: title
          }, url.config).then((response) => {
            this.socket.emit('updateBoardTitle', response.data._id, response.data.title)
          })
          .catch((error) => {
            alert('An error occured when updating the board title'+error)
          })
          
    }

    updateBoardTitle(id, title){
        if(id === this.state.board._id){
            let newBoard=this.state.board
            newBoard.title=title
            this.setState({board:newBoard})
        }
    }

    handleInputChange(e){
        this.setState({titleNewBoard: e.target.value})
    }

    onClickDeleteBoard(id){
        confirmAlert({
            title: 'Delete the board ?',
            message: 'This board will be removed and you won\'t be able to re-open it. There is no undo !',
            confirmLabel: 'Delete',                           // Text button confirm
            cancelLabel: 'Cancel',                             // Text button cancel
            onConfirm: () => (
              axios.delete(url.api + 'board/' + id, url.config)
              .then((response) => {
                this.socket.emit('deleteBoard', id)
                this.props.deleteBoard(id)
              })
              .catch((error) => {
                alert('An error occured when deleting the board'+error)
              })
            )
        })
    }
    
}
export default HomeUserBoard