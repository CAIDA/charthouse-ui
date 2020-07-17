/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

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
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// auth
import AuthorizedRoute from 'Auth/authorized-route';
import Sidebar from './sidebar';
// "pages"
import SymRedirect from './sym-redirect';

import Login from './login';
import Logout from './logout';
import LoginCallback from './login-callback';

import Profile from './user/profile';
import Pending from './user/pending';

import Quickstart from './pages/quickstart';
import Docs from './pages/docs';
import About from './pages/about';
import Acks from './pages/acks';
import Explorer from 'Explorer';
import Platforms from './pages/feeds';
import Dashboards from './pages/dashboards';
import Examples from './pages/examples';

import Home from './pages/home';
// TODO: switch to SVG/font so that nav coloring works correctly
import hicubeLogo from 'images/logos/hicube-icon-white.png';
import hicubeLogoText from 'images/logos/hicube-text-white.png';
import HijacksApp from "./pages/feeds/hijacks/hijacks";

// TODO: nested routes (see https://devhints.io/react-router)
// TODO: default route and not-found route

class ContentRouter extends React.Component {
    render() {
        return <Switch>
            {/* internal routes (not explicitly linked) */}
            <AuthorizedRoute path='/@:tag' component={SymRedirect}/>

            {/* auth routes */}
            <Route path='/login' component={Login}/>
            <Route path='/logout' component={Logout}/>
            <Route path='/auth/callback' component={LoginCallback}/>

            {/* user management routes */}
            <AuthorizedRoute path='/user/profile' component={Profile}/>
            <Route path='/user/pending' component={Pending}/>

            {/* page routes */}
            <Route path='/quickstart' component={Quickstart}/>
            <Route path='/docs' component={Docs}/>
            <Route path='/about' component={About}/>
            <Route path='/acks' component={Acks}/>

            <AuthorizedRoute path='/explorer' permission='ui:explorer'
                             component={Explorer}/>
            <Route path='/feeds/hijacks' component={HijacksApp}/>
            <Route path='/feeds' component={Platforms}/>
            <Route path='/dashboards' component={Dashboards}/>
            <Route path='/examples' component={Examples}/>

            <Route path='/' component={Home}/>
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
        page: 'feeds',
        icon: <span className="glyphicon glyphicon-globe"/>,
        text: 'Data Feeds'
    },
    {
        page: 'dashboards',
        icon: <span className="glyphicon glyphicon-dashboard"/>,
        text: 'Live Dashboards'
    },
    {
        page: 'examples',
        icon: <span className="glyphicon glyphicon-heart"/>,
        text: 'Event Analyses'
    }
];

// which pages should/should not have a pinned sidebar
const PINNED_SIDEBAR_PAGES = {
    '/feeds/hijacks/events': false // observatory wants lots of space
};
SIDEBAR_LINKS.forEach(link => {
    if (link) {
        PINNED_SIDEBAR_PAGES[`/${link.page || ''}`] = link.pinned;
    }
});

const UNPINNED_PAGES_PREFIXES = ['/feeds/hijacks/events'];

class Hi3Content extends React.Component {

    render() {
        let sidebarPinned = PINNED_SIDEBAR_PAGES[this.props.location.pathname];
        if (sidebarPinned !== true && sidebarPinned !== false) {
            sidebarPinned = PINNED_SIDEBAR_DEFAULT;
        }
        for(let unpinned of UNPINNED_PAGES_PREFIXES){
            if(this.props.location.pathname.startsWith(unpinned)){
                sidebarPinned = false;
            }
        }
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
