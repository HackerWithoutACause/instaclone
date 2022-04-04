'use strict';

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import UserContext from './UserContext.js';

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
);
