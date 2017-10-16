import React from 'react'
import ReactDOM from 'react-dom'
import Header from './components/Header'
import NumberUser from './components/NumberUser'
import Board from './components/Board.js'
import Header from './components/Header'
import SocketIOClient from 'socket.io-client'

  class App extends React.Component{
    
    constructor(props){
      super(props)
      this.socket = SocketIOClient('http://localhost:8000');
    }

    render(){
      return(
        <div>
          <Header/>
          <NumberUser io={this.socket}/>
          <Board io={this.socket}/>
          <Footer/>
        </div>
      ) 
    }
}
ReactDOM.render(<App/>, document.getElementById('root'));
