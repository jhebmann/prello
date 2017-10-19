import React from 'react'
import {Button} from 'react-bootstrap';

// Not done yet
class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};

        this.handleMailChange = this.handleMailChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePassChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        alert('email: ' + this.state.email + ' || pass: ' + this.state.password);
        event.preventDefault();
    }

    render(){
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
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={this.handlePassChange} name="password"/>
                    </div>
                    <Button bsStyle="success" onClick={this.handleSubmit}>Signup</Button>
                </form>
            </div>
        )
    }
}

export default Register;