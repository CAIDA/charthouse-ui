// external CSS deps
// TODO: fix green color on success button hover
import 'css/theme/css/bootstrap-flatly.css';

// global CSS styles
// TODO: there are probably some explorer-specific styles in here
import 'css/base.css';

// library imports
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
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

// TODO: move sidebar page config here

// which pages should/should not have a pinned sidebar
const PINNED_SIDEBAR_DEFAULT = true;
const PINNED_SIDEBAR_PAGES = {
    '/explorer': false
};
class Hi3Content extends React.Component {
    render() {
        const thisPagePinned = PINNED_SIDEBAR_PAGES[this.props.location.pathname];
        const sidebarPinned = PINNED_SIDEBAR_DEFAULT &&
            (thisPagePinned === true || thisPagePinned !== false);
        return <div>
            <Sidebar isPinned={sidebarPinned}/>
            <div id='hi3-container'
                 className={sidebarPinned ? 'sidebar-expanded' : ''}>
                <ContentRouter/>
            </div>
        </div>
    }
}
const Hi3ContentWithRouter = withRouter(Hi3Content);

class Hi3App extends React.Component {

    render() {
        return <BrowserRouter>
            <Hi3ContentWithRouter/>
        </BrowserRouter>;
    }

}
ReactDOM.render(<Hi3App/>, document.getElementById('root'));
