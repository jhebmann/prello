import React from 'react'
import Board from './Board'
import SocketIOClient from 'socket.io-client'
import url from '../../config'
import Auth from '../Auth/Auth'
const Dropbox = require('dropbox')

class HomeBoard extends React.Component{

    constructor(props){
      super(props)
      this.socket = SocketIOClient(url.socket)

      this.state={
        dbx: null,
        files: []
      }
    }

    componentWillMount(){
      if (Auth.isUserAuthenticatedWithDropbox()) {
        const dbx = new Dropbox({ accessToken: Auth.getDropboxToken() })
        this.setState({dbx: dbx})
      }
    }

    render(){
      const address = JSON.stringify(this.props.location.pathname)
      const id = address.substring(address.lastIndexOf("/") + 1, address.length-1)
      return(
        <div className="boardContainer">
          <Board parentProps={this.props} io={this.socket} id={id} dbx={this.state.dbx} />
        </div>
      )
    }
}


export default HomeBoard