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

// TODO: switch to SVG/font so that nav coloring works correctly
import hicubeLogo from 'images/logos/hicube-icon-white.png';
import hicubeLogoText from 'images/logos/hicube-text-white.png';

// TODO: nested routes (see https://devhints.io/react-router)
// TODO: default route and not-found route

class ContentRouter extends React.Component {
    render() {
        return <Switch>
            {/* internal routes (not explicitly linked */}
            <Route path='/@:tag' component={SymRedirect}/>

            {/* auth routes */}
            <Route path='/login' component={Login}/>
            <Route path='/logout' component={Logout}/>
            <Route path='/auth/callback' component={LoginCallback}/>

            {/* user management routes */}
            <AuthorizedRoute path='/user/profile' component={Profile}/>
            <Route path='/user/pending' component={Pending}/>

            {/* page routes */}
            <Route path='/' component={Home}/>
            <AuthorizedRoute path='/explorer' permission='ui:explorer'
                             component={Explorer}/>
        </Switch>;
    }
}

const PINNED_SIDEBAR_DEFAULT = true;
// which pages should be linked to (in addition to home)
const SIDEBAR_LINKS = [
    {
        isBrand: true,
        icon: <img src={hicubeLogo}/>,
        text: <img src={hicubeLogoText}/>,
    },
    null, // separator
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
        text: 'Time Series Explorer',
        pinned: false
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

// which pages should/should not have a pinned sidebar
const PINNED_SIDEBAR_PAGES = {};
SIDEBAR_LINKS.forEach(link => {
    if (link) {
        PINNED_SIDEBAR_PAGES[`/${link.page || ''}`] = PINNED_SIDEBAR_DEFAULT &&
            (link.pinned === true || link.pinned !== false)
    }
});

class Hi3Content extends React.Component {

    render() {
        const sidebarPinned = PINNED_SIDEBAR_PAGES[this.props.location.pathname];
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
