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
import AuthenticatedRoute from 'Auth/authenticated-route';
import AuthorizedRoute from 'Auth/authorized-route';

// "pages"
import Home from './home';
import SymRedirect from './sym-redirect';
import Login from './login';
import LoginCallback from './login-callback';
import Logout from './logout';
import Profile from './user/profile';
import Explorer from 'Explorer';
import Pending from './user/pending';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path='/@:tag' component={SymRedirect}/>
            <Route path='/login' component={Login}/>
            <Route path='/logout' component={Logout}/>
            <Route path='/auth/callback' component={LoginCallback}/>
            <AuthorizedRoute path='/explorer' permission='ui:explorer' component={Explorer}/>
            <AuthenticatedRoute path='/user/profile' component={Profile}/>
            <Route path='/user/pending' component={Pending}/>
            <Route path='/' component={Home}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
