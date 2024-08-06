import React from 'react';


const CameraCard = ({name, url, children}) => {
    return(
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <img src={url} className="card-img-top" alt={name} />
                {children}
            </div>
        </div>
    );
};


export default CameraCard;