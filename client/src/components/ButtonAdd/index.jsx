import React from 'react';
import './style.css';

const Button = ({ onClick, label }) => {
    return (
        <button className='btnAdd' onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;