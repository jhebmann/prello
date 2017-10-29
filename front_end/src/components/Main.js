import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Login/Login'
import Register from './Register/Register'
import Auth from '../Auth/Auth.js';

const Main = () => (
  <main>
    <Switch>
      <Route path='/board/:id' component={Home}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
    </Switch>
  </main>
)

export default Main
