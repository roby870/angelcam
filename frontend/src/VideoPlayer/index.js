import React from 'react';
import MjpegPlayer from './MjpegPlayer';
import H264Player from './H264Player';



const VideoPlayer = ({src, type}) => {


    const videoStrategies = {
        "mjpeg": MjpegPlayer,
        "h264": H264Player,
    };
    

    const VideoComponent = videoStrategies[type];
    if (!VideoComponent) {
        return(<p>Video format not supported.</p>);
    }
    return(<VideoComponent src={src} />);
};


export default VideoPlayer;