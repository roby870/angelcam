import React from 'react';


const CameraCard = ({name, mjpeg_url, children}) => {
    return(
        <div className="card mb-4">
            <div className='card-header' style={{border: 'none', backgroundColor: 'white'}}>
                <h5 className="card-title">{name}</h5>
            </div>
            <div className="card-body">
                <img src={mjpeg_url} className="card-img-top" alt={name} />
            </div>
            <div className='card-footer' style={{border: 'none', backgroundColor: 'white'}}>
                {children}
            </div>
        </div>
    );
};


export default CameraCard;