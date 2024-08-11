import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';


const CameraLiveDisplay = () => {

    const { url } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');


    return(
        <VideoPlayer src={url} type={type}  />
    );



};


export default CameraLiveDisplay;