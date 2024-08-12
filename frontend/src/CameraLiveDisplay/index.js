import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import NavigationBar from '../NavigationBar';


const CameraLiveDisplay = () => {

    const liveLinks = [
        { label: 'Home', path: 'http://localhost:3000/' },
      
      ];


    const { url } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');


    return(
        <>
            <NavigationBar links={liveLinks} /> 
            <VideoPlayer src={url} type={type}  /> 
        </>
    );



};


export default CameraLiveDisplay;