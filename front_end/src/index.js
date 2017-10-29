import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import Board from './components/Board/HomeBoard'
import Login from './components/Auth/Login/Login'
import Register from './components/Auth/Register/Register'
import NotFound from './components/NotFound/NotFound'
import Header from './components/Marginals/Header'
import Auth from './components/Auth/Auth.js';

import './index.css'

render((
  
  <BrowserRouter>
    <div className='rootDiv'>
      <Header />
      <Switch>
      {Auth.isUserAuthenticated() ? (
      <Route exact path='/' component={Home}/>
      ) : (
        <Route path='/error' component={Login}/>
      )}
        <Route path='/board/:id' component={Board}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </BrowserRouter>
  
), document.getElementById('root'));
    