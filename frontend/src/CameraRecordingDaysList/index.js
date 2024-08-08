import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CameraRecordingClipsList from './CameraRecodingClipsList';
import Accordion from 'react-bootstrap/Accordion';

const CameraRecordingDaysList = () => {

    
    const { id } = useParams();
    const initialRender = useRef(true);
    const navigate = useNavigate();
    const [recordingDays, setRecordingDays] = useState([]);
  
  
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
            const response = await axios.get(`http://127.0.0.1:8000/recording/shared-recording-days/${id}/`);
            setRecordingDays(response.data)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }
    }, [navigate, id]);


    //const renderDate()
  
  
    return (
        <div className="container mt-5">
            <div className="row">
            <Accordion >
                {recordingDays.map(item => (
                    <div className="col-8 mt-4 mx-auto" key={item.recording_start}>
                        <CameraRecordingClipsList eventKey={item.recording_start} id={id} start={item.recording_start} end={item.recording_end}>

                        </CameraRecordingClipsList>
                    </div>
              ))}
              </Accordion>
            </div>
        </div>
    );
  };
  
  
  export default CameraRecordingDaysList;