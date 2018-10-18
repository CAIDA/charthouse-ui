// external CSS deps
// TODO: fix green color on success button hover
import 'css/theme/css/bootstrap-flatly.css';

// global CSS styles
// TODO: there are probably some explorer-specific styles in here
import 'css/base.css';

// library imports
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// auth
import { AuthenticatedRoute } from 'Auth';

// "pages"
import Home from './home';
import Login from './login';
import Logout from './logout';
import Explorer from 'Explorer';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path='/login'>
                <Login/>
            </Route>
            <Route path='/logout'>
                <Logout/>
            </Route>
            <AuthenticatedRoute path='/explorer'>
                <Explorer/>
            </AuthenticatedRoute>
            <Route path='/'>
                <Home/>
            </Route>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
