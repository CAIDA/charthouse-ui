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
import AuthorizedRoute from 'Auth/authorized-route';

import Sidebar from './sidebar';

// "pages"
import Home from './home';
import SymRedirect from './sym-redirect';
import Login from './login';
import LoginCallback from './login-callback';
import Logout from './logout';
import Profile from './user/profile';
import Explorer from 'Explorer';
import Pending from './user/pending';

// TODO: nested routes (see https://devhints.io/react-router)
// TODO: default route and not-found route

class ContentRouter extends React.Component {
    render() {
        return <Switch>
                <Route path='/@:tag' component={SymRedirect}/>
                <Route path='/login' component={Login}/>
                <Route path='/logout' component={Logout}/>
                <Route path='/auth/callback' component={LoginCallback}/>
                <AuthorizedRoute path='/explorer' permission='ui:explorer'
                                 component={Explorer}/>
                <AuthorizedRoute path='/user/profile' component={Profile}/>
                <Route path='/user/pending' component={Pending}/>
                <Route path='/' component={Home}/>
            </Switch>;
    }
}

class Hi3App extends React.Component {

    render() {
        return <BrowserRouter>
            <div>
                <Sidebar/>
                <div id='hi3-container'>
                    <ContentRouter/>
                </div>
            </div>
        </BrowserRouter>;
    }

}

ReactDOM.render(<Hi3App/>, document.getElementById('root'));
