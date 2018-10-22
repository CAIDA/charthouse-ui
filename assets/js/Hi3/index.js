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
import LoginCallback from './login-callback';
import Logout from './logout';
import Profile from './profile';
import Explorer from 'Explorer';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path='/login' component={Login}/>
            <Route path='/logout' component={Logout}/>
            <Route path='/auth/callback' component={LoginCallback}/>
            <AuthenticatedRoute path='/explorer' component={Explorer}/>
            <AuthenticatedRoute path='/user/profile' component={Profile}/>
            <Route path='/' component={Home}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
