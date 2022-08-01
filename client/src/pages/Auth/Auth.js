import React, { useState } from 'react'
import '../../styles/style.css'
import {Container, Nav, Navbar, Row, Col, Card} from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel'
import Logo from '../../assets/Icon.png'
import Login from '../../commponent/authModal/Login';
import Register from '../../commponent/authModal/Register';
import { API } from '../../config/api';
import { useQuery } from 'react-query';
import convertRupiah from 'rupiah-format';

export default function Auth() {

    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);

    const registerHere = (e) => {
        e.preventDefault();
        setRegisterShow(false);
        setLoginShow(true);
    }

    const loginHere = (e) => {
        e.preventDefault();
        setLoginShow(false);
        setRegisterShow(true);
    }

    let { data: film } = useQuery('filmsCache', async () => {
        const response = await API.get('/Landing');
        return response.data.data;
      });

  return (
    <div>
        <Navbar bg="black" variant="dark" expand="lg" className='navbg'>
        <Container>
            <Navbar.Brand href="#"><img src={Logo} style={{ maxWidth: '200px' }} alt="" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className='groupnavmenu'>
                <Nav.Link style={{ color:'white'}}><button onClick={() => setLoginShow(true)}>Login</button></Nav.Link>
                <Nav.Link style={{ color:'white' }} ><button onClick={() => setRegisterShow(true)}>Register</button></Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>

{/* list slide item */}
        <Carousel className='swiperContainer'>
        {film?.map((item, index) => (
                <Carousel.Item key={index} onClick={() => setLoginShow(true)}>
                    <img
                    className="imageCarousel"
                    src={item.image}
                    alt={item.image.name}
                    />
                    <Carousel.Caption>
                    <div className='caption'>
                    <h3 className='judul'>{item.title}</h3>
                    <p className='category'>{item.category}</p>
                    <p className='price'>{convertRupiah.convert(item.price)}</p>
                    <p className='detailCaption'>{item.desc}</p>
                    <button onClick={() => setLoginShow(true)}>Buy Now</button>
                    </div>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>

{/* list slide item */}
        <div className='containerListFilm'>
        <p className='user-text'>List Film</p>
            <Container className='ms-0'>
                <Row>
                {film?.map((item, index) => (
                        <Col  lg={3} md={4} sm={8} xs={12} key={index}>
                            <Card className="product-card mb-3">
                                <Card.Img variant="top" src={item.image} className='product-image' onClick={() => setLoginShow(true)}/>
                            </Card>
                        </Col>  
                        ))}     
                </Row>
                
            </Container>
        </div>

{/* modal */}
<Login loginHere={loginHere} loginShow={loginShow} setLoginShow={setLoginShow} />
<Register registerHere={registerHere} registerShow={registerShow} setRegisterShow={setRegisterShow} />

    </div>
  )
}
