import React from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { useNavigate, useSearchParams } from 'react-router-dom';


function CameraRecodingClipsListItem({id, start, end}) {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    //hacer un handle para que cuando hagan clic en la card 
    //se muestre un spinner, se pida la url, y se redirija al video
    const CardClickableWrapper = ({ onClick, children }) => (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          {children}
        </div>
      );


    const handleClick = () => {
        const fetchData = async () => {
          try {
            const isoDateStringStart = start.replace(' ', 'T') + 'Z';
            const isoDateStringEnd = end.replace(' ', 'T') + 'Z';
            const response = await axios.get(`http://127.0.0.1:8000/recording/shared-recording-stream/${id}/${isoDateStringStart}/${isoDateStringEnd}/`);
            const encodedUrl = encodeURIComponent(response.data);
            navigate(`/clip-display/${encodedUrl}/?startTime=${start}&endTime=${end}&type=${type}`);
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
                    {start} - {end}
                </Card.Body>
            </Card>
        </CardClickableWrapper>        
    );
}


export default CameraRecodingClipsListItem;