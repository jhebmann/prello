import React from 'react'
import { Button,FormGroup,FormControl, Nav, Navbar, NavItem} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Auth from '../Auth/Auth.js'

class Header extends React.Component{
  render(){
    const guestNavbar = (
      <Navbar className="navbar-fixed-top" responsive='true' collapseable='true'>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/"> Prello </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <FormGroup>
              <FormControl type="text" placeholder="Search" />
            </FormGroup>
            {' '}
            <Button type="submit">Submit</Button>
          </Navbar.Form>
          <Nav pullRight>
          {Auth.isUserAuthenticated() ? 
          (
            <Nav pullRight>
            <LinkContainer to="/login" onClick={Auth.deauthenticateUser}>
              <NavItem>
                Log Out
              </NavItem>
            </LinkContainer>
            </Nav>):
            (<Nav pullRight>
            <LinkContainer to="/login">
              <NavItem>
                Login
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/register">
              <NavItem>
                Register
              </NavItem>
            </LinkContainer></Nav>) }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )

    return(
      <div className="headerMenu">{guestNavbar}</div>
    )}
  }

export default Header
