import React from 'react'
import SocketIOClient from 'socket.io-client'
import axios from 'axios'
import url from '../../config'
import Auth from '../Auth/Auth.js'
import {Button, Card, Col, Collapse, Icon, Row} from 'antd'
import { Redirect } from 'react-router-dom'
import handleServerResponse from '../../response'
import HomeUserBoard from '../Home/HomeUserBoard'
const Panel = Collapse.Panel

class Search extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            teams: [],
            boards: [],
            lists: [],
            cards: [],
            comments: [],
            attachments: [],
            checklists: [],
            items: [],
            text: this.props.match.params.text,
            pageLoaded: false,
            redirect: null
        }

        this.getResults = this.getResults.bind(this)

        this.socket = SocketIOClient(url.socket)
        this.renderAllBoards = this.renderAllBoards.bind(this)
        this.renderTeams = this.renderTeams.bind(this)
    }

    componentWillMount() {
        if(Auth.isUserAuthenticated()){
            this.getResults()
        }
        else
            this.setState({pageLoaded:true})
    }

    loadTeams(){
        return axios.get(url.api + 'user/' + Auth.getUserID() + '/teams', url.config)
        .catch((error) => {
            handleServerResponse(error, 'An error occured when getting the teams')
        })
    }

    loadUsers(){
        return axios.get(url.api + 'user/', url.config)
        .catch((error) => {
            handleServerResponse(error, 'An error occured when getting all the users')
        })
    }

    render () {
        return (
            (this.state.teams.length === 0 && this.state.boards.length === 0 && this.state.lists.length === 0 && this.state.cards.length === 0) ?
            <h2 style={{"textAlign": "center"}}>No result found for the text {this.state.text}</h2>
            :
            <div className="container">
                {this.state.redirect}
                {this.renderTeams()}
                {this.renderAllBoards()}
                {this.renderAllLists()}
                {this.renderAllCards()}
            </div>
        )
    }

    getResults(){
        axios.get(url.api + "search/" + this.state.text + "/user/" + Auth.getUserID(), url.config)
        .then((response) => {
            this.setState({teams: response.data.teams, boards: response.data.boards, lists: response.data.lists, cards: response.data.cards, comments: response.data.comments, attachments: response.data.attachments, checklists: response.data.checklists, items: response.data.items, pageLoaded: true})
        }).catch((error) => {
            handleServerResponse(error, 'An error occured when searching for the text ' + this.state.text)
        })
    }

    renderTeams(){
        const teams = this.state.teams
        const teamItems = teams.map((team)=>
            <div key = {team._id} className='teamContainer' onClick = {() => this.setState({redirect: <Redirect to = {{pathname: '/', state: team._id}} />})}>
                <Collapse bordered={true}>
                    <Panel header={<h3><Icon type="team" />{team.name}</h3>} key={team._id}></Panel>
                </Collapse>
            </div>
        )
        return teamItems
    }

    renderAllBoards(){
        if (this.state.boards.length === 0) return
        return (
            <div className='teamContainer' >
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header={<h3><Icon type="team" />Boards</h3>} key="1">
                        <div>
                            <Row gutter={16}>
                                {this.renderBoards()}
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    renderBoards(){
        const boards = this.state.boards
        const boardItems = boards.map((board)=>
        <Col span={5} key={board._id} className="boardPreview">
            <div className="clickable" onClick={() => window.location = "/board/"+board._id}>
              <HomeUserBoard board={board} deleteBoard={this.deleteBoard} socket={SocketIOClient(url.socket)}/>
            </div>
        </Col>
        )
        return boardItems
    }

    renderAllLists(){
        if (this.state.lists.length === 0) return
        return (
            <div className='teamContainer' >
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header={<h3><Icon type="team" />Lists</h3>} key="1">
                        <div>
                            <div className="homeDiv">
                                <Row gutter={16}>
                                    {this.renderLists()}
                                </Row>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    renderLists(){
        const lists = this.state.lists
        const listItems = lists.map((list)=>
            <Col span={5} key={list._id}>
                <div className="clickable" onClick={() => this.setState({redirect: <Redirect to = {{pathname: '/board/' + list.boardId, state: {listId: list._id}}} />})}>
                    <Card title={list.title || "No title"}>
                    </Card>
                </div>
            </Col>
        )
        return listItems
        //this.props.history.push({pathname: '/board/' + list.boardId, parameters: {listId: list._id}})
    }

    renderAllCards(){
        if (this.state.cards.length === 0) return
        return (
            <div className='teamContainer' >
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header={<h3><Icon type="team" />Cards</h3>} key="1">
                        <div>
                            <div className="homeDiv">
                                <Row gutter={16}>
                                    {this.renderCards()}
                                </Row>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    renderCards(){
        const cards = this.state.cards
        const cardItems = cards.map((card)=>
            <Col span={5} key={card._id}>
                <div className="clickable" onClick={() => this.setState({redirect: <Redirect to = {{pathname: '/board/' + card.boardId, state: {cardId: card._id}}} />})}>
                    <Card title={card.title || "No title"}>
                        <p>{card.description}</p>
                    </Card>
                </div>
            </Col>
        )
        return cardItems
    }
}

export default Search