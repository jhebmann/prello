import React from 'react';
import ReactDOM from 'react-dom';
import List from './List.js';
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
      );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));




/*
    dat=[{
      id_list: 1,
      title_list: "TODO",
      cards: [{
          title_card: "Learn Node js",
          id_card: 7448,
          date: 1018
        },
        {
          title_card: "Learn Node js",
          id_card: 7448,
          date: 1018
        },
        {
          title_card: "Learn Node js",
          id_card: 7448,
          date: 1018
        }
      ]
    },
    {
      id_list: 2,
      title_list: "TODO",
      cards: [{
          title_card: "Learn Node js",
          id_card: 7448,
          date: 1018
        }
      ]
    }

  ]
*/