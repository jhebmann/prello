import React from 'react'
import {Button} from 'react-bootstrap';

// Not done yet
class Login extends React.Component{

    constructor(props) {
        super(props);
        this.state = {nickname: '', password: ''};

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleNicknameChange = this.handleNicknameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePassChange(event) {
        this.setState({password: event.target.value});
    }

    handleNicknameChange(event) {
        this.setState({nickname: event.target.value});
    }

    handleSubmit(event) {
        alert('nickname: ' + this.state.nickname + ' || pass: ' + this.state.password);
        event.preventDefault();
    }

    render(){
        let isEnabled = 
            this.state.password.length > 0 && 
            this.state.nickname.length > 0;
        return (
            <div>
                <h1> Login </h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Nickname
                            <input type="text" value={this.state.nickname} onChange={this.handleNicknameChange} name="nickname"/>
                        </label>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={this.handlePassChange} name="password"/>
                    </div>
                    <input type="submit" value="Signup" disabled={!isEnabled}/>
                </form>
            </div>
        )
    }
}

export default Login;