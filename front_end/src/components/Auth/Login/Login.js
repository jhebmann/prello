import React from 'react'
import { FormErrors } from './FormErrors';
import './Form.css';
import Auth from '../Auth.js';
import { Redirect } from 'react-router-dom'
import {ListGroupItem} from 'react-bootstrap'

// Not done yet
class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            password: '', 
            nickname: '',
            formErrors: {nickname: '', password: ''},
            passwordValid: false,
            nicknameValid: false,
            formValid: false,
            redirect: false,
            errorMssge:null,
            error:false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.processForm = this.processForm.bind(this)
        
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
        if (this.state.redirect) 
            return <Redirect to='/'/>
        return (
          <form className="demoForm" onSubmit={this.processForm}>
            <h2>Login</h2>
            <div className="panel panel-default">
              <FormErrors formErrors={this.state.formErrors} />
            </div>
            <div className={`form-group ${this.errorClass(this.state.formErrors.nickname)}`}>
              <label htmlFor="nickname">Nickname</label>
              <input type="text" required className="form-control" name="nickname"
                placeholder="Nickname"
                value={this.state.nickname}
                onChange={this.handleUserInput}/>
            </div>

            <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleUserInput}  />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Login</button>
            { this.state.error ? <ListGroupItem bsStyle="danger" >{this.state.errorMssge}</ListGroupItem> : null }
            
          </form>
        )
    }

    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();
    
        // create a string for an HTTP body message
        const nickname = encodeURIComponent(this.state.nickname);
        const password = encodeURIComponent(this.state.password);
        const formData = `nickname=${nickname}&password=${password}`;
    
        // create an AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open('post', 'http://localhost:8000/auth/login');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            // success
    
            // change the component-container state
            this.setState({
              errors: {}
            });
    
            // save the token
            
            Auth.authenticateUser(xhr.response.token);
            Auth.setUserId(xhr.response.user.id)
            // change the current URL to /
            this.setState({ redirect: true })
          } else {
            // failure
            // console.log(xhr.status)
            // change the component state
            const errors = xhr.response.errors ? xhr.response.errors : {};
            errors.summary = xhr.response.message;
            
            this.setState({
              error:true,
              errorMssge:errors.summary
            });
          }
        });
        xhr.send(formData);
      }
}

export default Register;