import React from 'react'
import { Redirect } from 'react-router-dom'
import Auth from './Auth'

class DropboxAuth extends React.Component{
    constructor(props) {
        super(props)
        
        const queryString = require('query-string')
        const parsed = queryString.parse(window.location.hash)

        Auth.setDropboxToken(parsed.access_token)

        this.state = {
            access_token: parsed.access_token,
            account_id: parsed.account_id,
            state: parsed.state,
            pathname: parsed.state.split('|')[0],
            cardId: parsed.state.split('|')[1],
            token_type: parsed.token_type,
            uid: parsed.uid
        }
        
        

    }

    render() {
        return <Redirect to={{pathname: this.state.pathname, cardToFocus: this.state.cardId, access_token: this.state.access_token}} />
    }
}

export default DropboxAuth