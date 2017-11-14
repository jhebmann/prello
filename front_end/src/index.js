import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HomeUser from './components/Home/HomeUser'
import Board from './components/Board/HomeBoard'
import Login from './components/Auth/Login/Login'
import Search from './components/Search/Search'
import Register from './components/Auth/Register/Register'
import NotFound from './components/NotFound/NotFound'
import UnAuthorized from './components/Unauthorized/UnAuthorized'
import Header from './components/Marginals/Header'
import { Redirect } from 'react-router-dom'

import './index.css'

const queryString = require('query-string');
render((
  
  <BrowserRouter>
    <div className='rootDiv'>
      <Header />
      <Switch>
        <Route exact path='/' component={HomeUser}/>
        <Route path='/unauthorized' component={UnAuthorized}/>
        <Route path='/board/:id' component={Board}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/search/:text' component={Search}/>
        <Route path='/dropboxAuth' component={() => <Redirect to = {{pathname: queryString.parse(window.location.hash).state.split('|')[0], state: queryString.parse(window.location.hash).state.split('|')[1]}} />}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </BrowserRouter>
  
), document.getElementById('root'));
    