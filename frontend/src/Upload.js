import React, { useState, useContext } from 'react';
import UserContext from './UserContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import './Upload.sass';

const Upload = () => {
    const { user, refreshUser } = useContext(UserContext);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const formData = new FormData();
        formData.append('image', ev.target.files[0]);

        fetch("/upload", {
            method: 'POST',
            body: formData,
        })
            .then(async (res) => console.log(await res.json()))
            .catch((err) => ("Error occured", err));
    };

    return (
        <span>
            <input type='file' id='image' onChange={handleSubmit} hidden/>
            <label htmlFor='image'><FontAwesomeIcon icon={ faCirclePlus }/></label>
        </span>
    );
};

export default Upload;
