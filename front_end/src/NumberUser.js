import React from 'react';

class NumberUse extends React.Component{

    constructor(props){
        super(props);
        this.state={
            numberUsers:null
        };
        
        this.initialize = this.initialize.bind(this);
        this.onConnectedUser = this.onConnectedUser.bind(this);
        this.connectUser = this.connectUser.bind(this);
        this.socket = this.props.io;
        
        this.socket.on('connectedUser', this.onConnectedUser);
        this.socket.on('initialize', this.initialize);  //We should use componentDidMount() ?
    }

    initialize(){
        this.socket.emit('newUser', null);
    }

    onConnectedUser(number) {
        this.connectUser(number);
      }

    connectUser(number){
        this.setState({numberUsers:number})
    }

    render() {
        return (<h3>Users Online : {this.state.numberUsers}</h3>);
    }
}

export default NumberUse;