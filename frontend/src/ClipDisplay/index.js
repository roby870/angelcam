import React, { useRef, useState, useEffect }  from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';



const ClipDisplay = () => {
    
    const { url } = useParams();
    const initialRender = useRef(true);
    const playerRef = useRef(null);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [streamPaused, setStreamPaused] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const progressBarRef = useRef(null); 
    const [isDragging, setIsDragging] = useState(false);
    const [showTicks, setShowTicks] = useState(true);


    useEffect(() => {
        const handleResize = () => {
            setShowTicks(window.innerWidth >= 768); 
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize); 
        };
    }, []);


    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            const startTimeParam = searchParams.get('startTime'); 
            const endTimeParam = searchParams.get('endTime');   
            if (startTimeParam && endTimeParam) {
                const startTimestamp = new Date(startTimeParam).getTime() / 1000;
                const endTimestamp = new Date(endTimeParam).getTime() / 1000;
                const videoDuration = endTimestamp - startTimestamp;
                setDuration(videoDuration);
                setStartTime(startTimestamp);
                setEndTime(endTimestamp);
                if (playerRef.current) {
                    playerRef.current.seekTo(0, 'seconds');  
                }
            }
        }
    }, [searchParams]);


    const handleProgress = (state) => {
        const currentTime = state.playedSeconds; //ReactPlayer's state
        setPlayedSeconds(currentTime); 
        if(state.loadedSeconds > duration && !streamPaused){ //Pause stream
            const fetchData = async () => {
                try{
                    const regex = /^https:\/\/([^/]+)\/recording\/streams\/([^/]+)\//;
                    const match = url.match(regex);
                    const streamer_domain = match[1];
                    const stream_id = match[2];
                    const response = await axios.post(`https://${streamer_domain}/recording/streams/${stream_id}/pause/`);
                    setStreamPaused(true)
                }
                catch (error){
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
        if (currentTime >= duration) {
            playerRef.current.getInternalPlayer().pause(); 
        }
    };


    const handleSeek = (newTime) => {
        setPlayedSeconds(newTime);
        playerRef.current.seekTo(newTime, 'seconds');
        if(playerRef.current.getInternalPlayer().paused){
            playerRef.current.getInternalPlayer().play();
        }
    };


    const formatTimestampToDateTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString();
    };


    const handleMouseDown = (event) => {
        setIsDragging(true);
        updateSeekPosition(event);
    };


    const handleMouseMove = (event) => {
        if (isDragging) {
            updateSeekPosition(event);
        }
    };


    const handleMouseUp = () => {
        setIsDragging(false);
    };


    const updateSeekPosition = (event) => {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = event.clientX - rect.left;
        const newTime = (clickPosition / rect.width) * duration;
        handleSeek(newTime);
    };


    const renderTimeTicks = () => {
        const ticks = [];
        for (let i = 0; i <= duration; i += 15) {
            const leftPosition = (i / duration) * 100;
            let transformValue = 'translateX(-50%)';
            if (i === 0) {
                transformValue = 'none';
            } else if (i === duration) {
                transformValue = 'translateX(-100%)';
            }
            ticks.push(
                <div 
                    key={i} 
                    style={{ 
                        position: 'absolute', 
                        left: `${leftPosition}%`, 
                        top: '15px', 
                        transform: transformValue, 
                        fontSize: '12px' 
                    }}
                >
                    {formatTime(startTime + i)}
                </div>
            );
        }
        return ticks;
    };
    

    return (
        <div className="player-wrapper d-flex justify-content-center align-items-center flex-column mt-3">
            { type === "h264" ? 
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    playing={true}
                    controls={false}
                    width="80%"
                    height="80%"
                    onProgress={handleProgress}
                    progressInterval={100}
                /> :
                <img src={url} className="card-img-top" alt="clip" /> 
            }
            <div
                ref={progressBarRef}
                style={{ position: 'relative', width: '80%', height: '30px', backgroundColor: '#e0e0e0'}}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: `${Math.min((playedSeconds / duration) * 100, 100)}%`,
                        width: '2px',
                        height: '100%',
                        backgroundColor: 'red',
                    }}
                />
                <div style={{ position: 'absolute', left: 0 }}>{formatTimestampToDateTime(startTime)}</div>
                <div style={{ position: 'absolute', right: 0 }}>{formatTimestampToDateTime(endTime)}</div>
                {showTicks && renderTimeTicks()}
            </div>
        </div>
    );
};

export default ClipDisplay;

