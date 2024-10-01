import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import CameraCard from '../CameraCard';
import Button from 'react-bootstrap/Button';

const Home = () => {

  const initialRender = useRef(true);
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextUrl, setNextUrl] = useState("");


  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/camera/shared-cameras/', {
            withCredentials: true  
          });
          setCameras(response.data.results)
          setHasMore(response.data.next !== null);
          setNextUrl(response.data.next)
        } catch (error) {
          if (error.status === 401){
            navigate('/login');
          }
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [navigate]);


  const handleNextPage = (event) => {
    const fetchNextPage = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/camera/shared-cameras/${nextUrl}/`, {
          withCredentials: true  
        });
        setCameras(response.data)
        setCameras(prevCameras => {return [...prevCameras, ...response.data.results]});
        setHasMore(response.data.next !== null);
        setNextUrl(response.data.next)
      } catch (error) {
        if (error.status === 401){
          navigate('/login');
        }
        console.error('Error fetching data:', error);
      }
    };
    fetchNextPage();
  }


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
          <InfiniteScroll
              className="row row-cols-1 g-4"
              dataLength={cameras.length} // This is important to set to the length of the data
              next={handleNextPage}
              scrollThreshold={0}
              hasMore={hasMore}
              loader={
                  <div className="d-flex justify-content-center my-3">
                      <div className="spinner-border text-primary" role="status">
                          <span className="sr-only"> </span>
                      </div>
                  </div>
              }
              endMessage={
                  <p style={{ textAlign: 'center' }}>
                      
                  </p>
              }
          >
              {cameras.map(item => (
                <div className="col-md-4 d-flex align-items-stretch" key={item.id}>
                  <CameraCard name={item.name} mjpeg_url={item.mjpeg_url}>
                    <Button variant="primary" value={item.hls_url? item.hls_url : item.mjpeg_url} data-type={item.type} onClick={handleFullScreenButtonClick}>Full screen</Button>
                    {item.has_recording && <Button className='ms-3' variant="primary" value={item.id} data-type={item.type} onClick={handleClipsButtonClick}>Clips</Button>}
                  </CameraCard>
                </div>
              ))}
          </InfiniteScroll>
      </div>
    </div>
  );
};


export default Home;