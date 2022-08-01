import React from 'react'
import '../../styles/style.css'
import {Container, Row, Col, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel'
import { API } from '../../config/api';
import { useQuery } from 'react-query';
import convertRupiah from 'rupiah-format';

export default function HomePage() {
    
    let { data: film } = useQuery('filmsCache', async () => {
        const response = await API.get('/Film');
        return response.data.data;
      });

  return (
    <div>
    {/* list slide item */}
    <Carousel className='swiperContainer'>
        {film?.map((item, index) => (
                <Carousel.Item 
                key={index}
                as={Link} to={`/user/detail-film/${item.id}`}
                >
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
                    <button>Buy Now</button>
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
                            <Link style={{ textDecoration: 'none' }} to={`/user/detail-film/${item.id}`}>
                            <Card className="product-card mb-3">
                                <Card.Img variant="top" src={item.image} className='film-image' />
                            </Card>
                            </Link>
                        </Col>  
                        ))}     
                </Row>
                
            </Container>

        </div>
    </div>
  )
}
