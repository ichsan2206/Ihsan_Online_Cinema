import React, {useEffect, useState, useContext} from 'react'
import { Row, Col, Card, Alert } from 'react-bootstrap'
import '../../styles/style.css'
import { API } from '../../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import convertRupiah from 'rupiah-format';
import { UserContext } from '../../context/userContext'

export default function DetailFilm() {
  const [state] = useContext(UserContext);

  let navigate = useNavigate();
  let { id } = useParams();
  const [show, setShow]=useState(true)

  let { data: film } = useQuery('productCache', async () => {
    const response = await API.get('/Film/' + id);
    return response.data.data;
  });

  let transaction = useQuery('chace handleBuy', async () => {
    const trans = await API.get('/MyListFilm');
    return trans.data.data;
    console.log(trans);
  });

  console.log(transaction.data);
  
// console.log(state);
// let tid = transaction.film?.id
  // if(state.id === transaction.film.id){
  //   if(transaction.status == "success"){
  //     setShow(false)
  //   }
  // }else{
  //   setShow(true)
  // }


  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-3SZeGcpD3kKlTTw3";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [])

  const handleBuy = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = {
        idFilm: film.id,
        idSeller: film.user.id,
        price: film.price,
      };

      const body = JSON.stringify(data);

      const response = await API.post('/Transaction', body, config);

      // Create variabel for store token payment from response here ...
      const token = response.data.payment.token;

      // Init Snap for display payment page with token here ...
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          navigate("/user/profile");
          <Alert variant="success" className="py-1">
          thank you for buying this film, please wait 1x24 hours because your transaction is in process
          </Alert>
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          navigate("/user/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      })

    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='user-container'>
        <Row>
            <Col lg={3}>
                    <Card className="product-card mb-3">
                        <Card.Img variant="center" src={film?.image} className='film-image' />
                    </Card>
            </Col>
            <Col lg={8}>
            <div className='row mb-3'>
            <h3 style={{color: 'white'}} className="col-10">{film?.title}</h3>
          
           <button 
            style={{color: 'white', 
            backgroundColor: '#CD2E71', 
            padding: '3px', 
            borderRadius: '5px'}} 
            onClick={(e) => handleBuy.mutate(e)} className={`col`}>Buy Now</button>
            
            </div>

            <div>
            <iframe
                    src={film?.link}
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                    width="600" 
                    height="200"
                />
            </div>
            <div>
            <p style={{color: '#7E7E7E'}}>{film?.category}</p>
            <p style={{color: '#CD2E71'}}>{convertRupiah.convert(film?.price)}</p>
            <p style={{color: '#FFFFFF'}}>{film?.desc}</p>
            </div>
            </Col>
        </Row>
    </div>
  )
}
