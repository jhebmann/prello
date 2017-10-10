import React from 'react';
import { Button,Navbar,FormGroup,FormControl } from 'react-bootstrap';


class NavbarElem extends React.Component{
    render(){
      return(
        <div>
        <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="https://frozen-depths-69455.herokuapp.com/">Prello</a>
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
        </Navbar.Collapse>
      </Navbar>
      </div>
      );
    }
  }

export default NavbarElem;