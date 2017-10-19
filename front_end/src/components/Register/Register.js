import React from 'react'
import {Button} from 'react-bootstrap';

// Not done yet
class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {email: '', password: '', nickname: ''};

        this.handleMailChange = this.handleMailChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleNicknameChange = this.handleNicknameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePassChange(event) {
        this.setState({password: event.target.value});
    }

    handleNicknameChange(event) {
        this.setState({nickname: event.target.value});
    }

    handleSubmit(event) {
        alert('nickname: ' + this.state.nickname + ' email: ' + this.state.email + ' || pass: ' + this.state.password);
        event.preventDefault();
    }

    render(){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEnabled = 
            re.test(this.state.email) && 
            this.state.password.length > 0 && 
            this.state.nickname.length > 0;
        return (
            <div>
                <h1> Signup </h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Email
                            <input type="text" value={this.state.email} onChange={this.handleMailChange} name="email"/>
                        </label>
                    </div>
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

export default Register;