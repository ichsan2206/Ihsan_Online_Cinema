
import React, { useContext, useState } from 'react';
import { Modal, Alert } from 'react-bootstrap'
import { UserContext } from '../../context/userContext';
import { useMutation } from 'react-query';

import { API } from '../../config/api';

export default function Register({ registerShow, setRegisterShow, registerHere }) {

    const [state, dispatch] = useContext(UserContext);

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
    });
  
    const { name, email, password } = form;
  
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = useMutation(async (e) => {
      try {
        e.preventDefault();
  
        // Configuration Content-type
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
  
        // Data body
        const body = JSON.stringify(form);
  
        // Insert data user to database
        const response = await API.post('/Register', body, config);
  
        // Notification
        if (response.data.status === 'success') {
          const alert = (
            <Alert variant="success" className="py-1">
              Success
            </Alert>
          );
  
          console.log(response);
          setMessage(alert);
          setForm({
            name: '',
            email: '',
            password: '',
          });
        } else {
          const alert = (
            <Alert variant="danger" className="py-1">
              Failed
            </Alert>
          );
          setMessage(alert);
        }
      } catch (error) {
        console.log(error);
        if (error.message == 'Request failed with status code 400'){
          const alertPassword = (
            <Alert variant="danger" className="py-1">
             Registered Email
            </Alert>
          );     
        setMessage(alertPassword);
         }
      
      }
    });

    return (
        <Modal size='md' show={registerShow} onHide={() => setRegisterShow(false)} centered>
            <Modal.Body className="bg-Modal">
            <div className="card-auth p-4">
                    <div
                    style={{ fontSize: '30px', lineHeight: '49px', fontWeight: '700', color: '#CD2E71'}}
                    className="mb-3"
                    >
                    Register
                    </div>
                    {message && message}
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className="mt-3 form">
                        <input
                         type="text"
                         placeholder="Name"
                         value={name}
                         name="name"
                         onChange={handleChange}
                        className="px-3 py-2 mt-3"
                        />
                        <input
                         type="email"
                         placeholder="Email"
                         value={email}
                         name="email"
                         onChange={handleChange}
                        className="px-3 py-2 mt-3"
                        />
                        <input
                         type="password" 
                         placeholder="Password"
                         value={password}
                         name="password"
                         onChange={handleChange}
                        className="px-3 py-2 mt-3"
                        
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn">Register</button>
                        <p className='warning'>Already have an account? <button onClick={registerHere} className="btnHere" >Click here</button></p>
                    </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}