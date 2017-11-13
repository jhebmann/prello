import React from 'react';
import List from './List.js';
import {Button, FormControl} from 'react-bootstrap';
import './board.css'
import CascadeTeam from './CascadeTeam.js'
import axios from 'axios'
import url from '../../config'
import {Spin} from 'antd';
import Auth from '../Auth/Auth.js'

class Board extends React.Component{
    
    constructor(props){
        super(props)
        
        this.state={
            board: null,
            allTeams: [],
            users: [],
            titleNewList: "",
            parameters: this.props.parentProps.location.state,
            pageLoaded: false
        }

        this.socket = this.props.io;
        this.getAllLists = this.getAllLists.bind(this)
        this.onClickAddList = this.onClickAddList.bind(this)
        this.createList = this.createList.bind(this)
        this.deleteList = this.deleteList.bind(this)
        this.socket.on('addList', this.createList)
        this.socket.on('deleteListClient', this.deleteList)
    }

    componentDidMount() {
        const instance= this
        axios.all([this.loadBoard(), this.loadTeams(),this.loadUsers()])
        .then(axios.spread(function (res1, res2,res3) {
          instance.getAllLists(res1.data.lists)
          instance.setState({board:res1.data,users:res3.data,allTeams:res2.data,pageLoaded:true})
        }))
    }

    loadTeams(){
        return axios.get(url.api + 'team', url.config)
        .catch((error) => {
          alert('An error occured when getting the teams!\nHint: check that the server is running')
        })
      }

    loadBoard(){
        return axios.get(url.api + 'board/' + this.props.id , url.config)
        .catch((error) => {
          alert('An error occured when getting the Board!\nHint: check that the server is running')
        })
    }

    loadUsers(){
        return axios.get(url.api + 'user/', url.config)
         .catch((error) => {
           alert('An error occured when getting all the users!\nHint: check that the server is running'+error)
         })
       }

    render(){
        return(
            <div className='board'>
                {
                    this.state.pageLoaded ? 
                    (
                        <div>
                            {this.cardList(this.state.board.lists)}
                            <div id="addListDiv">
                                <FormControl type = "text" name = "titleNewList" value = {this.state.titleNewList} placeholder = "Add a list..."
                                    onChange = {this.handleInputChange} id="addListInput" onKeyPress={this.handleKeyPress}
                                />
                                <Button bsStyle="success" id='addListButton' onClick={this.onClickAddList} disabled={this.state.titleNewList.trim().length < 1}>
                                    Add List
                                </Button>
                                {this.renderOptions()}
                            </div>
                        </div>
                    ):
                    (
                        <div className="spinn">
                            <Spin size='large' />
                        </div>
                    ) 
                }
            </div>
        )
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.titleNewList) {
                this.onClickAddList()
            } 
        }
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    getAllLists(data){
        data.sort(function(a, b){ return a.pos - b.pos})
        this.setState({board:{lists: data}})
    }

    onClickAddList(){
        axios.post(url.api + 'list/board/' + this.props.id, {
            title: this.state.titleNewList.trim(),
            pos: this.state.board.lists.length
        }, url.config).then((response) => {
            this.socket.emit('newList', response.data, this.props.id)
            this.createList(response.data, this.props.id)
        })
        .catch((error) => {
            alert('An error occured when adding the lists'+error)
        })
        this.setState({titleNewList: ""})
    }

    createList(newList, idBoard){
        if (idBoard === this.props.id){
            let newBoard = Object.assign({}, this.state.board, {lists:this.state.board.lists.concat(newList)});
            this.setState({board: newBoard})
        }
    }

    cardList(lists){
        const listItems= lists.map((list, index)=>
            <List key={list._id} parameters = {this.state.parameters} cards={list.cards} id={list._id} io={this.socket} title={list.title} idBoard={this.props.id}/>
        )
        return listItems
    }

    deleteList(listId) {
        let newBoard = this.state.board
        console.log(newBoard.lists)
        newBoard.lists = newBoard.lists.filter(list => list._id !== listId)
        this.setState( prevState => ({
          board: newBoard
        }))
    }

    renderOptions(){
        if(this.state.board.admins.includes(Auth.getUserID())){
            return(
            <div>
                <CascadeTeam teams={this.state.allTeams.filter(team=>!team.boards.includes(this.props.id))} boardId={this.props.id} remove={false}/>
                <CascadeTeam teams={this.state.allTeams.filter(team=>team.boards.includes(this.props.id))} boardId={this.props.id} remove={true}/>
            </div>
            )
        }    
    }
}
export default Board;