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

      this.loadDropBoxFiles = this.loadDropBoxFiles.bind(this)
    }



    componentWillMount(){
      this.loadDropBoxFiles()
    }

    render(){
      const address = JSON.stringify(this.props.location.pathname)
      const id = address.substring(address.lastIndexOf("/") + 1, address.length-1)
      const dropbox = {dbx: this.state.dbx, files: this.state.files}
      return(
        <div className="boardContainer">
          <Board parentProps={this.props} io={this.socket} id={id} dropbox={dropbox} />
        </div>
      ) 
    }

    loadDropBoxFiles(){
      if (Auth.isUserAuthenticatedWithDropbox()) {
        // Create an instance of Dropbox with the access token and use it to
        // fetch and render the files in the users root directory.
        const dbx = new Dropbox({ accessToken: Auth.getDropboxToken() })
        this.setState({dbx: dbx})
        dbx.filesListFolder({path: ''})
        .then((response) => {
          this.setState({files: response.entries})
        })
        .catch(function(error) {
            console.error(error)
        })
    }
    }
}


export default HomeBoard