import React from 'react';
import { Button,FormGroup,FormControl, Nav, Navbar, NavItem} from 'react-bootstrap';


class NavbarElem extends React.Component{
  render(){
    const navbarInstance = (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Prello</a>
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
            {/*<NavItem href="/login">Login</NavItem>
            <NavItem href="/register">Register</NavItem>*/}
            <NavItem> <a href="/login">Login</a></NavItem>
            <NavItem> <a href="/register">Register</a></NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
    return(
      <div>{navbarInstance}</div>
    )}
  }

export default NavbarElem
