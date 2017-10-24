import React from 'react'
import { FormErrors } from './FormErrors'
import './Form.css'


class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            email: '', 
            password: '', 
            nickname: '',
            formErrors: {email: '', nickname: '', password: ''},
            emailValid: false,
            passwordValid: false,
            nicknameValid: false,
            formValid: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
                        () => { this.validateField(name, value) });
    }
    
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let nicknameValid = this.state.nicknameValid;
    
        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;
            case 'nickname':
                nicknameValid = value.length >= 3;
                fieldValidationErrors.nickname = nicknameValid ? '': ' is too short';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        emailValid: emailValid,
                        nicknameValid: nicknameValid,
                        passwordValid: passwordValid
                        }, this.validateForm);
    }
    
    validateForm() {
            this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.nicknameValid});
    }
    
    errorClass(error) {
            return(error.length === 0 ? '' : 'has-error');
    }
    
    render () {
        return (
          <form className="demoForm" onSubmit={this.handleSubmit}>
            <h2>Sign up</h2>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
            </div>
            <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
              <label htmlFor="email">Email</label>
              <input type="email" required className="form-control" name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleUserInput}  />

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
            <button type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Sign up</button>
          </form>
        )
    }
}

export default Register