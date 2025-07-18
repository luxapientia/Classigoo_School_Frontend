'use client';

import React from 'react';

const ImageButton = ({ image_url, onClick, width = "50px" }) => {
    return (
        <div 
            onClick={onClick}
            style={{ 
                width: width, 
                cursor: 'pointer',
                display: 'inline-block'
            }}
        >
            <img 
                src={`/assets/images/${image_url}`}
                alt="button" 
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    );
};

export default ImageButton; 