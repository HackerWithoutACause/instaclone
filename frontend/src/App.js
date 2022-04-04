import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, Outlet, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonCirclePlus, faPersonCircleMinus } from '@fortawesome/free-solid-svg-icons';
import UserContext from './UserContext.js';
import Nav from './Nav.js';
import Upload from './Upload.js';
import Posts from './Posts.js';
import NotFound from './NotFound.js';
import Settings from './Settings.js';
import _ from 'lodash';
import './App.sass';

const login = async (username, password) => {
    const data = JSON.stringify({ username: username, password: password });
    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data,
    });
    const body = await res.json();

    return res.status;
};

const Login = () => {
    const [state, setState] = useState({ username: '', password: '', error: '' });
    const { user, refreshUser } = useContext(UserContext);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const res = await login(state.username, state.password);

        if(res !== 200) {
            setState({ ...state, error: 'Username or password incorrect.' });
            return;
        }

        refreshUser();
    };

    const handleInputChange = (ev) => {
        const target = ev.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.id;
        setState({ ...state, [name]: value });
    };

    if(!user)
        return (
            <form className="Login" autoComplete="off" onSubmit={handleSubmit}>
                <input className='lowercase' type='text' id='username' placeholder='Username' onChange={handleInputChange} required/>
                <input type='password' type='password' id='password' placeholder='Password' onChange={handleInputChange} required/>
                <div className='errors'>{state.error}</div>
                <input type='submit' value='Login'/>
            </form>
        );
    else
        return (<Navigate replace to='/'/>);
};

const Users = () => {
    const [users, setUsers] = useState({ query: '', users: null });

    const refreshUsers = async () => {
        // setUsers({ ...users, users: null });
        const res = await fetch('/users/' + users.query);
        setUsers({ ...users, users: await res.json() });
    };

    useEffect(async () => {
        document.title = 'Instaclone — Users';
        refreshUsers();
    }, []);

    const follow = (username, action) => {
        return async (e) => {
            const body = JSON.stringify({ username: username });
            await fetch('/' + action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body,
            });

            refreshUsers();
        };
    };

    // <FontAwesomeIcon icon={ user.following ? faPersonCirclePlus : faPersonCircleMinus } />

    const user = (user) => {
        return (
            <div key={user._id}>
                <Link to={'/@' + user._id}>{user.displayName} (@{user._id})</Link>
                <button
                    className='follow'
                    onClick={follow(user._id, user.following ? 'unfollow' : 'follow')}>
                    <FontAwesomeIcon icon={ user.following ? faPersonCircleMinus : faPersonCirclePlus } />
                </button>
            </div>
        );
    };

    if(users)
        return (
            <div className='users'>
                <form className='search-user'>
                    <input
                        type='text'
                        placeholder='Search Users'
                        onChange={(e) => {
                            users.query = e.target.value;
                            refreshUsers();
                        } }
                    />
                </form>
                { users.users ? (<div>{ users.users.map(user) }</div>) : <div className='loader'><div /></div> }
            </div>
        );
    else
        return ''
};

const SignUp = (props) => {
    const { user, refreshUser } = useContext(UserContext);
    const [state, setState] = useState({ message: null });

    const handleInputChange = (ev) => {
        const target = ev.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.id;
        setState({ ...state, [name]: value });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const body = JSON.stringify(_.pick(state, 'username', 'password', 'email', 'displayName'));
        const res = await fetch('/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body,
        });
        const message = await res.json();

        if(res.status !== 200) {
            setState({ ...state, message: message.message });
            return;
        }

        await login(state.username, state.password);
        refreshUser();
    };

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <input type='text' className='lowercase' id='username' placeholder='USERNAME' onChange={handleInputChange} required/>
            <input type='text' id='displayName' placeholder='DISPLAY NAME' onChange={handleInputChange} required/>
            <input type='email' id='email' placeholder='EMAIL' onChange={handleInputChange} required/>
            <input type='password' id='password' placeholder='PASSWORD' onChange={handleInputChange} required/>
            <div className='errors'>
                { state.message }
            </div>
            <input type='submit' value='Sign Up'/>
        </form>
    );
};

const User = (props) => {
    let { username } = useParams();

    return (
        <div>
            <Posts username={ username }/>
        </div>
    );
};

const Homepage = () => {
    const { user, refreshUser } = useContext(UserContext);

    if(user)
        return (<Posts />);
    else
        return(<><SignUp /><Login /></>);
};

const App = () => {
    const [state, setState] = useState({ user: null, loading: true });
    async function refreshUser() {
        const res = await fetch('/user');
        const body = await res.json();

        if(res.status === 401) {
            setState({ user: null, loading: false });
            return;
        }

        if(res.status !== 200)
            throw body.message;

        setState({ user: body, loading: false });
    };

    useEffect(refreshUser, []);

    let user = state.user;

    if(state.loading)
        return (<div className='loader'><div /></div>)
    else
        return (
            <UserContext.Provider value={{ user, refreshUser }}>
                <BrowserRouter>
                    <Nav />
                    <main>
                        <Routes>
                            <Route index element={ <Homepage /> } />
                            <Route path='signup' element={ <SignUp /> } />
                            <Route path='login' element={ <Login /> } />
                            <Route path='signup' element={ <SignUp /> } />
                            <Route path='upload' element={ <Upload /> } />
                            <Route path='users' element={ <Users /> } />
                            <Route path='user' element={ <Posts username='user8'/> } />
                            <Route path='/@:username' element={ <User /> } />
                            <Route path='settings' element={ <Settings /> } />
                            <Route path='*' element={ <NotFound /> } />
                        </Routes>
                    </main>
                </BrowserRouter>
            </UserContext.Provider>
        );
}

export default App;
