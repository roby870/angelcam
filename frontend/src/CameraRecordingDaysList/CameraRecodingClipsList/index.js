import React, { useState } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import CameraRecodingClipsListItem from './CameraRecodingClipsListItem';


function CameraRecordingClipsList({eventKey, id, start, end}){ 

    const [clips, setClips] = useState([]);
    const [doFetch, setDoFetch] = useState(true); //We will execute the fetch only once
    

    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () => {
            if(doFetch){
                const isoDateStringStart = start.replace(' ', 'T') + 'Z';
                const isoDateStringEnd = end.replace(' ', 'T') + 'Z';
                const fetchData = async () => {
                    try {
                      const response = await axios.get(`http://127.0.0.1:8000/recording/shared-recording-clips/${id}/${isoDateStringStart}/${isoDateStringEnd}/`);
                      setDoFetch(false)
                      setClips(response.data)
                    } catch (error) {
                      console.error('Error fetching data:', error);
                    }
                  };
                fetchData();
            }
        },);
    
        return (
        <Button variant="primary"
                onClick={decoratedOnClick}
        >
            {children}
        </Button>
        );
    }

    return(
        <Card style={{ border: 'none' }}>
            <Card.Header className="mx-auto" style={{ backgroundColor: 'white', borderBottom: 'none' }}>
                <CustomToggle eventKey={eventKey}>{start} - {end}</CustomToggle>
            </Card.Header>
            <Accordion.Collapse className="mx-auto" eventKey={eventKey}>
                <Card.Body>
                    {doFetch && <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                    }
                    {clips.map(item => (
                        <CameraRecodingClipsListItem key={item.start} id={id} start={item.start} end={item.end}>
                        </CameraRecodingClipsListItem>                
                    ))}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}


export default CameraRecordingClipsList;