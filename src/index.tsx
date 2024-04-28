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
import PageIndex from './components/PageIndex';

// error handler (!!! REQUIRED !!!)
const { name } = require('../package.json');



//
const root = createRoot(
    document.getElementById('root') as HTMLDivElement
);
root.render(
   <>
    <PageIndex></PageIndex>
   </>
   
);



