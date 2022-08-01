import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Link } from 'react-router-dom'
import { Col, Row, Card, Button } from 'react-bootstrap'
import dateFormat from 'dateformat';
import convertRupiah from "rupiah-format";
import { useQuery } from 'react-query';
import UserBlank from '../../assets/blank-profile.png'

import { API } from '../../config/api';

export default function Profile() {

    const [state] = useContext(UserContext);

    let { data: transactions } = useQuery('ChaceTransaction', async () => {
        const response = await API.get('/Transaction');
        return response.data.data;
      });

      console.log(transactions);

  return (
    <div className='user-container'>
            <div className='row'>
            <div className="col-lg-3 col-md-6 col-sm-12">
                <p className='user-text'>My Profile</p>
                <div className='container-profil-pitc'>
                <img src={UserBlank} className="profile-pict" alt="..." />
                </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 pt-5 mb-3">
                <p className="card-title-text">Name</p>
                <p className="profile-card-text m-0">{state.user.name}</p>
                <p className="card-title-text mt-4">Email</p>
                <p className="profile-card-text m-0">{state.user.email}</p>
                <p className="card-title-text mt-4">Phone</p>
                <p className="profile-card-text m-0">08921887312</p>
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12" style={{ padding: '0' }}>
                <p className='user-text'>My Transaction</p>
                {transactions?.map((item, index) => (
                    <Card className='mb-2 history-card' key={index}>
                        <Row style={{marginLeft: '5px', marginBottom: '2px'}}>
                            <Col sm={8}>
                                <p className='card-title-text' style={{ marginTop: '10px', color: 'white', fontSize: '20px' }}>{item.film?.title}</p>
                                <p className='history-card-date'>{dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}</p>
                                <p className='history-card-text' style={{ marginTop: '20px' }}><b>Total: {convertRupiah.convert(item.price)}</b></p>
                            </Col>
                            <Col sm={3}>
                            <p
                            className={`status-transaction-${item.status} d-flex align-items-center justify-content-center`}>
                            {item.status}
                            </p>
                            </Col>
                        </Row>
                    </Card>
                 ))}
            </div>
            </div>
        </div>
  )
}
