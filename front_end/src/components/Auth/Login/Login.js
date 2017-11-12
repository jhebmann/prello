import React from 'react'
import './Form.css';
import Auth from '../Auth.js';
import { Redirect } from 'react-router-dom'
import {ListGroupItem} from 'react-bootstrap'
import axios from 'axios'
import url from '../../../config'
const NotificationSystem = require('react-notification-system');

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
            errorMssge:null,
            error:false,
            redirect: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.processForm = this.processForm.bind(this)
        this.addNotification = this.addNotification.bind(this)
        this.redirect = this.redirect.bind(this)
        
    }
    
    notifications = null

    addNotification = (type, message) => {
        const onRemove = (type === 'success') ? this.redirect : null

        this.notifications.addNotification({
            message: message,
            level: type,
            position: 'tc',
            autoDismiss: 3,
            onRemove: onRemove
        });
    }
    
    componentWillMount = () => {
        if (Auth.getUserID())
            this.redirect()
    }
    
    componentDidMount = () => {
        this.notifications = this.refs.notificationSystem
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
    
    redirect(){
        this.setState({
            redirect: <Redirect to='/'/>
        })
    }
    
    render () {
        return (
          <form className="demoForm" onSubmit={this.processForm}>
            {this.state.redirect}
            <NotificationSystem ref="notificationSystem" />
            <h2>Login</h2>
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
        
        const userData = {
            nickname: this.state.nickname,
            password: this.state.password
        }

        axios.post(url.socket + 'auth/login/', userData, url.config)
        .then((response) => {
            this.setState({
                error: false,
                errorMssge: null
            })
            Auth.authenticateUser(response.data.token);
            Auth.setUserId(response.data.user.id)
            Auth.setNickname(response.data.user.nickname)
            this.addNotification('success', 'You successfully logged in. You will be redirected to the front page soon')
        })
        .catch((error) => {
            let fieldValidationErrors = this.state.formErrors
            const message = error.response.data.message

            if (message.includes("password")){
                fieldValidationErrors.password = message
                this.setState({
                    formErrors: fieldValidationErrors,
                    passwordValid: false
                })
            } else {
                fieldValidationErrors.nickname = message
                this.setState({
                    formErrors: fieldValidationErrors,
                    nicknameValid: false
                })
            }
            this.addNotification('error', message)

            this.setState({
                error: true,
                errorMssge: message
            })
        })
        }
}

export default Register;