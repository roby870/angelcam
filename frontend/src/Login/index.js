import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Login(){

    
    const [alert, setAlert] = useState(null);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();


    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
    if (error.response && error.response.status === 401) {
      setAlert("Missing or invalid authorization");
    } else if (error.response && error.response.status === 403) {
        setAlert("Missing permission");
    }
    return Promise.reject(error);
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = qs.stringify({
            token: token,
            email: email
        });
        try {
            const response = await axios.post('http://127.0.0.1:8000/account/login/', data, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.status === 200) {
                localStorage.setItem('token', token);
                navigate('/');
            } 
          } catch (error) {
            
        }
    };
    

    return (
        <div className='container d-flex justify-content-center mt-5'>

            <Form onSubmit={handleSubmit} className=''>
                <Alert variant='danger' style={{display: alert ? "block" : "none"}}>
                    {alert} 
                </Alert>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Personal Access Token</Form.Label>
                    <Form.Control type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Your personal acess token" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Log in
                </Button>
            </Form>
        </div>
      );
  }
  
  
  export default Login;