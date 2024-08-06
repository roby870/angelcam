import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CameraCard from '../CameraCard';


const Home = () => {

  const initialRender = useRef(true);
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);


  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      const accessToken = localStorage.getItem('token');
      if (accessToken) {
        axios.defaults.headers.common['Authorization'] = `PersonalAccessToken ${accessToken}`;
      } else {
        navigate('/login');
      }
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/camera/shared-cameras/');
          setCameras(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [navigate]);


  return (
    <div className="container mt-5">
      <div className="row">
        {cameras.map(item => (
          <div className="col-md-4 d-flex align-items-stretch" key={item.id}>
            <CameraCard name={item.name} url={item.mjpeg_url}></CameraCard>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Home;