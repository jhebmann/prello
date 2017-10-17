import React from 'react'
import {Button} from 'react-bootstrap';

// Not done yet
class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render(){
        return (
            <div>
                <h1> Signup </h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Email
                            <input type="text" value={this.state.value} onChange={this.handleChange} />
                        </label>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password"/>
                    </div>
                    <Button bsStyle="success" onClick={this.onClickAddUser}>Signup</Button>
                </form>
            </div>
        )
    }
}

export default Register;