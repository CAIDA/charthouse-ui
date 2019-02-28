import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'react-router-dom';
import titleCase from 'title-case';

import {auth} from 'Auth';

import 'Hi3/css/sidebar.css';
// TODO: switch to SVG/font so that nav coloring works correctly
import hicubeLogo from 'images/logos/hicube-icon-white.png';
import hicubeLogoText from 'images/logos/hicube-text-white.png';

// TODO: properly support mobile:
//       - why does not work on iphone xs?
//       - handle click on hamburger
//       - toggle sidebar hidden when link clicked
//       - toggle sidebar hidden when main container clicked

class SidebarLink extends React.Component {

    static propTypes = {
        page: PropTypes.string,
        icon: PropTypes.node.isRequired,
        text: PropTypes.node
    };

    render() {
        const text = this.props.text || titleCase(this.props.page);
        return <li className={!this.props.page ? 'brand' : null}>
            <NavLink to={`/${this.props.page || ''}`}>
                <div className="icon">{this.props.icon}</div>
                <div className="text">{text}</div>
            </NavLink>
        </li>;
    }
}

// array of links to render
// the first element will be the brand
const LINKS = [
    {
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

class Sidebar extends React.Component {
    render() {
        let idx = 0;
        return <div>
            <div className="sidebar">
                <ul>
                    {LINKS.map(link => {
                        idx++;
                        return link ?
                            <SidebarLink key={idx} {...link}/> :
                            <div className='sidebar-separator' key={idx}/>;
                    })}
                    {auth.isAuthenticated() ?
                        (<div className='pull-bottom'>
                            <SidebarLink page='user/profile'
                                         icon={<span
                                             className="glyphicon glyphicon-user"/>}
                                         text={<div>Logged in
                                             as <i>{auth.getNickname()}</i></div>}
                            />
                            <SidebarLink page='logout'
                                         icon={<span
                                             className="glyphicon glyphicon-log-out"/>}
                            />
                        </div>)
                        : null};
                </ul>
            </div>
        </div>;
    }
}

export default Sidebar;
