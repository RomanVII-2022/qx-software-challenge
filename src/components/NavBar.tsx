import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
  return (
    <Navbar bg="light" data-bs-theme="light">
        <Container>
            <Navbar.Brand href="#home"><strong>QX-Challenge</strong></Navbar.Brand>
        </Container>
    </Navbar>
  )
}

export default NavBar