// external CSS deps
import '../css/theme/css/bootstrap-flatly.css';

// global CSS styles
// TODO: there are probably some explorer-specific styles in here
import '../css/base.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Explorer from "./Explorer/components/explorer";
import Login from './auth/login';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path="/">
                <Explorer/>
            </Route>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
