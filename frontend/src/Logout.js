import React, { useState, useContext } from 'react';
import UserContext from './UserContext.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Logout.sass';

const Logout = () => {
    const { user, refreshUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        await fetch("/logout", { method: 'POST' })
            .then(async (res) => console.log(await res.json()))
            .catch((err) => ("Error occurred", err));
        refreshUser();
        navigate('/');
    };

    return (
        <button
            className='logout'
            onClick={handleSubmit}>
            <FontAwesomeIcon icon={ faPersonWalkingArrowRight }/>
        </button>
    );
};

export default Logout;
