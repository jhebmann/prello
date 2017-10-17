import React from 'react'
import Board from './Board'
import NumberUser from './NumberUser'
import SocketIOClient from 'socket.io-client'

class Home extends React.Component{
    
    constructor(props){
      super(props)
      this.socket = SocketIOClient('http://localhost:8000');
    }

    render(){
      return(
        <div>
          <NumberUser io={this.socket}/>
          <Board io={this.socket}/>
        </div>
      ) 
    }
}


export default Home