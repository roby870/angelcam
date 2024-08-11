import ReactPlayer from 'react-player';


const H264Player = ({src}) => {
    return (
        <div className="player-wrapper d-flex justify-content-center mt-3">
            <ReactPlayer
                url={src}
                playing={true}
                controls={false}
                width="80%"
                height="80%"
            />
        </div>
    );
};

export default H264Player;