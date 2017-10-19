import React from 'react'
import { FormErrors } from './FormErrors';
import './Form.css';

// Not done yet
class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            password: '', 
            nickname: '',
            formErrors: {password: '', nickname: ''},
            passwordValid: false,
            nicknameValid: false,
            formValid: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        alert('nickname: ' + this.state.nickname + ' || pass: ' + this.state.password);
        event.preventDefault();
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
                        () => { this.validateField(name, value) });
    }
    
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let passwordValid = this.state.passwordValid;
        let nicknameValid = this.state.nicknameValid;
    
        switch(fieldName) {
            case 'password':
                passwordValid = value.length >= 1;
                fieldValidationErrors.password = passwordValid ? '': ' is empty';
                break;
            case 'nickname':
                nicknameValid = value.length >= 1;
                fieldValidationErrors.nickname = nicknameValid ? '': ' is empty';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        passwordValid: passwordValid,
                        nicknameValid: nicknameValid
                        }, this.validateForm);
    }
    
    validateForm() {
            this.setState({formValid: this.state.passwordValid && this.state.nicknameValid});
    }
    
    errorClass(error) {
            return(error.length === 0 ? '' : 'has-error');
    }
    
    render () {
        return (
          <form className="demoForm" onSubmit={this.handleSubmit}>
            <h2>Login</h2>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
            </div>
            <div className={`form-group ${this.errorClass(this.state.formErrors.nickname)}`}>
              <label htmlFor="nickname">Nickname</label>
              <input type="text" required className="form-control" name="nickname"
                placeholder="Nickname"
                value={this.state.nickname}
                onChange={this.handleUserInput}  />
            </div>

            <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleUserInput}  />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Login</button>
          </form>
        )
    }
}

export default Register;