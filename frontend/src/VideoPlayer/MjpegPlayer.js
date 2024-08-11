const MjpegPlayer = ({src}) => {
    return(
        <div className="container mt-3 w-75 h-75">
            <div className="row"> 
                <div className="col"> 
                    <img src={src} className="card-img-top" alt="live video" /> 
                </div>
            </div>
        </div>
    );
};


export default MjpegPlayer;