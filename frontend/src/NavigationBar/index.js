import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const NavigationBar = ({ links }) => {

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Angelcam</Navbar.Brand>
        <Nav className="me-auto">
          {links.map((link, index) => (
                   <Nav.Link key={index} href={link.path}>{link.label}</Nav.Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};


NavigationBar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired
};

export default NavigationBar;