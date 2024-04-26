import React from 'react';
import { createRoot } from 'react-dom/client';
import {
    // IMPORTANT NOTE:  
    // Please do not use `BrowserRouter`, otherwise routing will not be available in the CORE PROGRAM
    HashRouter as Router
} from "react-router-dom";

// i18n
import './lang/i18n';

import RoutesConfig from './router/routes-config';

import userData from './utils/custom/get-user-data';

import './index.scss';

import entityTypeData from "./data/entity-type";

// error handler (!!! REQUIRED !!!)
const { name } = require('../package.json');
(window as any)[`PLUGIN_HANDLE_ERR_${name}`] = () => {
    // This is the default homepage URL of the project, BUT you cannot use `/` (because if the child projects all use routing, 
    // it will actually only change the hash after being mounted to the CORE PROGRAM, and the routing will still take effect. 
    // To prevent routing conflicts, you cannot use a single slash. )
    // At least it must be a URL with parameters, such as `/index-project-1`, `/index-project-2/0/-1`, `/index-project3`
    location.hash = `/page-index-groupwork/${localStorage.getItem('SITE_AUTH_CA_ORG_ID')}/${decodeURIComponent(userData() !== null ? userData().dept_type : '行政')}/-1/-1/${entityTypeData[0].value}/-1`;
}


//
const root = createRoot(
    document.getElementById('root') as HTMLDivElement
);
root.render(
    <React.StrictMode>

        <Router>
            <RoutesConfig />
        </Router>

    </React.StrictMode>
);