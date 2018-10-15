// external CSS deps
import 'css/theme/css/bootstrap-flatly.css';

// global CSS styles
// TODO: there are probably some explorer-specific styles in here
import 'css/base.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import auth from 'Auth';
import AuthenticatedRoute from 'Auth/route';

// "pages"
import Login from 'Auth/login';
import Explorer from 'Explorer';

// Fake auth provider
// auth.signout(); // DEBUG

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path='/login'>
                <Login/>
            </Route>
            <AuthenticatedRoute auth={auth} path='/'>
                <Explorer/>
            </AuthenticatedRoute>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
