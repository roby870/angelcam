import React, { useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';


function CameraRecodingClipsListItem({id, start, end}) {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [loading, setLoading] = useState(false);


    const CardClickableWrapper = ({ onClick, children }) => (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          {children}
        </div>
      );


    const handleClick = () => {
        const fetchData = async () => {
          try {
            setLoading(true)
            const isoDateStringStart = start.replace(' ', 'T') + 'Z';
            const isoDateStringEnd = end.replace(' ', 'T') + 'Z';
            const response = await axios.get(`http://127.0.0.1:8000/recording/shared-recording-stream/${id}/${isoDateStringStart}/${isoDateStringEnd}/`);
            const encodedUrl = encodeURIComponent(response.data);
            navigate(`/clip-display/${encodedUrl}/?startTime=${start}&endTime=${end}&type=${type}&id=${id}`);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      };


    return (
        <CardClickableWrapper onClick={handleClick}>
            <Card className="my-3 ms-1">
                <Card.Body >
                    {loading ? <div className='d-flex justify-content-center'>
                                  <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </Spinner>
                                </div> 
                              : <span>{start} - {end}</span>}
                </Card.Body>
            </Card>
        </CardClickableWrapper>        
    );
}


export default CameraRecodingClipsListItem;