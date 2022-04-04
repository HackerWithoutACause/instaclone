import { useContext, useState } from 'react';
import UserContext from './UserContext.js';
import { Navigate } from 'react-router-dom';
import 'css-toggle-switch/dist/toggle-switch.css';

const Settings = () => {
    const { user, refreshUser } = useContext(UserContext);

    if(!user)
        return <Navigate to='/login' />;

    const [ state, setState ] = useState({ displayName: user.displayName, visibility: user.visibility });

    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
    };

    const handleVisibilityChange = (e) => {
        setState({ ...state, 'visibility': e.target.id });
    };

    const visibilityChecked = (name) => {
        return state.visibility === name;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const body = JSON.stringify(_.pick(state, 'displayName', 'visibility'));
        const res = await fetch('/settings', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body,
        });
        const message = await res.json();

        if(res.status !== 200) {
            return;
        }

        refreshUser();
    };

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <legend>Display Name</legend>
            <input type='text' id='displayName' placeholder='Display Name' value={state.displayName} onChange={handleChange} />
            {/* <input type='password' placeholder='Password' /> */}
            <fieldset>
                <legend>Post Visibility</legend>
                <div className="switch-toggle switch-flat">
                    <input
                        id='public'
                        type='radio'
                        name='visibility'
                        onChange={handleVisibilityChange}
                        checked={visibilityChecked('public')}
                    />
                    <label
                        htmlFor='public'
                        data-tooltip='Any one can view your posts'
                    >
                        Visible to All
                    </label>

                    <input
                        id='following'
                        type='radio'
                        name='visibility'
                        onChange={handleVisibilityChange}
                        checked={visibilityChecked('following')}
                    />
                    <label
                        htmlFor='following'
                        data-tooltip='Only people who you follow and follow you will be able to see your posts'
                    >
                        Followers Only
                    </label>


                    <input
                        id='private'
                        type='radio'
                        name='visibility'
                        onChange={handleVisibilityChange}
                        checked={visibilityChecked('private')}
                    />
                    <label
                        htmlFor='private'
                        data-tooltip='No one expect you can view your posts'
                    >
                        Private
                    </label>

                    <a></a>
                </div>
            </fieldset>
            <input type='submit' value='Update' />
        </form>
    );
};

export default Settings;
