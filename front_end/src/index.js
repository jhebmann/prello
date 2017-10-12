import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board.js';
import NavbarElem from './NavbarElem'
import NumberUser from './NumberUser'
import SocketIOClient from 'socket.io-client';

  class App extends React.Component{
    
    constructor(props){
      super(props)
      this.socket = SocketIOClient('http://localhost:8000');
    }

    render(){
      return(
        <div>
          <NavbarElem/>
          <NumberUser io={this.socket}/>
          <Board io={this.socket}/>
        </div>
      ) 
    }
}
ReactDOM.render(<App />, document.getElementById('root'));
