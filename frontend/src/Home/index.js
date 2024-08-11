import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CameraCard from '../CameraCard';
import Button from 'react-bootstrap/Button';


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


  const handleFullScreenButtonClick = (event) => {
    const encodedUrl = encodeURIComponent(event.target.value);
    navigate(`/camera-live-display/${encodedUrl}/?type=${event.target.dataset.type}`);
  }

  const handleClipsButtonClick = (event) => {
    navigate(`/camera-recordings-list/${event.target.value}?type=${event.target.dataset.type}`);
  }

  
  return (
    <div className="container mt-5">
      <div className="row">
        {cameras.map(item => (
          <div className="col-md-4 d-flex align-items-stretch" key={item.id}>
            <CameraCard name={item.name} mjpeg_url={item.mjpeg_url}>
              <Button variant="primary" value={item.hls_url? item.hls_url : item.mjpeg_url} data-type={item.type} onClick={handleFullScreenButtonClick}>Full screen</Button>
              {item.has_recording && <Button className='ms-5' variant="primary" value={item.id} data-type={item.type} onClick={handleClipsButtonClick}>Clips</Button>}
            </CameraCard>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Home;