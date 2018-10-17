// external CSS deps
import 'css/theme/css/bootstrap-flatly.css';

// global CSS styles
// TODO: there are probably some explorer-specific styles in here
import 'css/base.css';

// library imports
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

// auth
import { auth, AuthenticatedRoute } from 'Auth';

// "pages"
import Login from 'Auth/login';
import Logout from 'Auth/logout';
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
            <AuthenticatedRoute auth={auth} path='/explorer'>
                <Explorer/>
            </AuthenticatedRoute>
            <Route path='/'>
                <div>
                    <p>Welcome to Hi3</p>
                    <Link to='/explorer'>Explorer</Link>
                    <br/>
                    <Link to='/logout'>Log out</Link>
                </div>
            </Route>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
