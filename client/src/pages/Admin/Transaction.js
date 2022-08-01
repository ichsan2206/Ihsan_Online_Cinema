import React from 'react'
import '../../styles/style.css'
import { Table, Row, Col } from 'react-bootstrap'
import { useQuery } from 'react-query';
import convertRupiah from 'rupiah-format';

import { API } from '../../config/api';

export default function Transaction() {

  let { data: transactions } = useQuery('CacheAdmin', async () => {
    const response = await API.get('/TransactionAdmin');
    return response.data.data;
  });

  console.log(transactions);


  return (
    <div className='table-container'>
      <Row>
        <Col>
          <div className="table-title mb-4">Incoming Transaction</div>
        </Col>
        <Col xs="12">
            <Table striped bordered hover variant="dark">
              <thead className=''>
                <tr style={{color: 'red', textAlign: 'center'}}>
                  <th style={{width: '5%'}}>No</th>
                  <th>Users</th>
                  <th>Film</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {transactions?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.buyer?.name}</td>
                    <td>{item.film?.title}</td>
                    <td> {convertRupiah.convert(item.price)}</td>
                    <td><p className={`tb-status-${item.status}`}>{item.status}</p></td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </Col>
      </Row>
    </div>
  )
}
