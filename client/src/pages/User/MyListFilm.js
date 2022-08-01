import React from 'react'
import '../../styles/style.css'
import {Container, Row, Col, Card} from 'react-bootstrap';
import { useQuery } from 'react-query';
import { API } from '../../config/api';
import { Link } from 'react-router-dom';

export default function MyListFilm() {

    let { data: transactions } = useQuery('ChaceTransaction', async () => {
        const response = await API.get('/MyListFilm');
        return response.data.data;
      });

      console.log(transactions);
  return (
    <div>
        <div className='containerListFilm'>
        <p className='user-text'>My List Film</p>
            <Container className='ms-0'>
                <Row>
                {transactions?.map((item, index) => (
                        <Col  lg={3} md={4} sm={8} xs={12} key={index}>
                            <Card className="product-card mb-3" as={Link} to={`/user/detail-film/${item.film?.id}`}>
                                <Card.Img variant="top" 
                                src={item.film?.image} 
                                className='film-image' 
                                />
                            </Card>
                        </Col>          
                    ))}
                </Row>
                
            </Container>
        </div>
    </div>
  )
}
