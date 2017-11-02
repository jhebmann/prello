import React from 'react'
import { FormErrors } from './FormErrors'
import './Form.css'
import { Redirect } from 'react-router-dom'
import {ListGroupItem} from 'react-bootstrap'

class Register extends React.Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            email: '', 
            password: '', 
            nickname: '',
            formErrors: {email: '', nickname: '', password: ''},
            emailValid: false,
            passwordValid: false,
            nicknameValid: false,
            formValid: false,
            redirect: false,
            error:false,
            errorMssge:null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.processForm = this.processForm.bind(this);
    }

    handleSubmit(event) {
        /*console.log(this.props)
        console.log(event)
        const newUser = {
            nickname: this.state.nickname,
            mail: this.state.email,
            password: this.state.password
        }*/
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
        if (this.state.redirect) 
            return <Redirect to='/login'/>
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
            <button type="submit" className="btn btn-primary" onClick={this.processForm} disabled={!this.state.formValid}>Sign up</button>
            { this.state.error ? <ListGroupItem bsStyle="danger" >{this.state.errorMssge}</ListGroupItem> : null }
          </form>
        )
    }
    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();
    
        // create a string for an HTTP body message
        const nickname = encodeURIComponent(this.state.nickname);
        const email = encodeURIComponent(this.state.email);
        const password = encodeURIComponent(this.state.password);
        const formData = `name=${nickname}&email=${email}&password=${password}`;
    
        // create an AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open('post', 'http://localhost:8000/auth/signup');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            // success
    
            // change the component-container state
            this.setState({
              error: {}
            });
    
            // set a message
            localStorage.setItem('successMessage', xhr.response.message);
    
            // make a redirect
            this.setState({ redirect: true })
          } else {
            // failure
            
            const errors = xhr.response.errors ? xhr.response.errors : {};
            errors.summary = xhr.response.errors.password||xhr.response.errors.email
            //console.log('Failed ', errors.summary)
            this.setState({
                error:true,
                errorMssge:errors.summary
            });
          }
        });
        xhr.send(formData);
      }
}

export default Register