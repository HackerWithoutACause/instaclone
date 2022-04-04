import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Logout from './Logout.js';
import './Nav.sass';
import UserContext from './UserContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faUser,
    faCirclePlus,
    faPersonWalkingArrowRight,
    faGear,
    faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import Upload from './Upload.js';

const Nav = () => {
    const { user, refreshUser } = useContext(UserContext);

    if(!user)
        return (
            <header>
                <h1>Insta-Clone</h1>
                <nav>
                    <NavLink to='/'><FontAwesomeIcon icon={ faHouse } /></NavLink>
                    <NavLink to='/login'><FontAwesomeIcon icon={ faUserPlus } /></NavLink>
                </nav>
            </header>
        )
    else
        return (
            <header>
                <h1>Insta-Clone</h1>
                <nav>
                    <NavLink to='/'><FontAwesomeIcon icon={ faHouse } /></NavLink>
                    <NavLink to='/users'><FontAwesomeIcon icon={ faUser } /></NavLink>
                    <Upload />
                    <NavLink to='/settings'><FontAwesomeIcon icon={ faGear } /></NavLink>
                    <Logout />
                </nav>
            </header>
        )
};

export default Nav;
