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
// which pages should be linked to (in addition to home)
const SIDEBAR_LINKS = [
    {
        page: 'quickstart',
        icon: <span className="glyphicon glyphicon-flash"/>
    },
    {
        page: 'docs',
        icon: <span className="glyphicon glyphicon-education"/>,
        text: 'Documentation'
    },
    {
        page: 'about',
        icon: <span className="glyphicon glyphicon-info-sign"/>
    },
    {
        page: 'acks',
        icon: <span className="glyphicon glyphicon-thumbs-up"/>,
        text: 'Acknowledgements'
    },
    null, // separator
    {
        page: 'explorer',
        icon: <span className="glyphicon glyphicon-equalizer"/>,
        text: 'Time Series Explorer'
    },
    {
        page: 'dashboards',
        icon: <span className="glyphicon glyphicon-dashboard"/>,
        text: 'Live Dashboards'
    },
    {
        page: 'examples',
        icon: <span className="glyphicon glyphicon-heart"/>,
        text: 'Sample Analyses'
    }
];
class Hi3Content extends React.Component {
    render() {
        const thisPagePinned = PINNED_SIDEBAR_PAGES[this.props.location.pathname];
        const sidebarPinned = PINNED_SIDEBAR_DEFAULT &&
            (thisPagePinned === true || thisPagePinned !== false);
        return <div>
            <Sidebar isPinned={sidebarPinned} links={SIDEBAR_LINKS}/>
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
