import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'react-router-dom';

import {auth} from 'Auth';

import 'Hi3/css/sidebar.css';
import hicubeLogo from 'images/logos/hicube-icon-white.png';
import hicubeLogoText from 'images/logos/hicube-text-white.png';

// TODO: properly support mobile:
//       - why does not work on iphone xs?
//       - handle click on hamburger
//       - toggle sidebar hidden when link clicked
//       - toggle sidebar hidden when main container clicked

class SidebarLink extends React.Component {

    static propTypes = {
        isBrand: PropTypes.bool,
        to: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        text: PropTypes.node.isRequired
    };

    render() {
        return <li className={this.props.isBrand ? 'brand' : null}>
            <NavLink to={this.props.to}>
                <div className="icon">{this.props.icon}</div>
                <div className="text">{this.props.text}</div>
            </NavLink>
        </li>;
    }
}

class Sidebar extends React.Component {
    render() {
        return <div>
            <div className="topbar visible-xs text-right">
                <div className="sidebar-toggle">
                    <span className="sidebar-toggle-icon glyphicon glyphicon-menu-hamburger"/>
                </div>
            </div>
            <div className="sidebar sidebar-hidden">
                <ul className="nav nav-pills nav-stacked">
                    <SidebarLink to='/' isBrand={true}
                                 icon={<img src={hicubeLogo}/>}
                                 text={<img src={hicubeLogoText}/>}
                    />

                    <div className='sidebar-separator'/>

                    <SidebarLink to='/quickstart'
                                 icon={<span className="glyphicon glyphicon-flash"/>}
                                 text={'Quickstart'}
                    />
                    <SidebarLink to='/docs'
                                 icon={<span
                                     className="glyphicon glyphicon-education"/>}
                                 text={'Documentation'}
                    />
                    <SidebarLink to='/about'
                                 icon={<span
                                     className="glyphicon glyphicon-info-sign"/>}
                                 text={'About Hi³'}
                    />
                    <SidebarLink to='/acks'
                                 icon={<span
                                     className="glyphicon glyphicon-thumbs-up"/>}
                                 text={'Acknowledgements'}
                    />

                    <div className='sidebar-separator'/>

                    <SidebarLink to='/explorer'
                                 icon={<span
                                     className="glyphicon glyphicon-equalizer"/>}
                                 text={'Time Series Explorer'}
                    />
                    <SidebarLink to='/dashboards'
                                 icon={<span
                                     className="glyphicon glyphicon-dashboard"/>}
                                 text={'Live Dashboards'}
                    />
                    <SidebarLink to='/examples'
                                 icon={<span
                                     className="glyphicon glyphicon-heart"/>}
                                 text={'Sample Analyses'}
                    />

                    {auth.isAuthenticated() ?
                        (<div className='pull-bottom'>
                            <SidebarLink to='/user/profile'
                                         icon={<span
                                             className="glyphicon glyphicon-user"/>}
                                         text={<div>Logged in
                                             as <i>{auth.getNickname()}</i></div>}
                            />
                            <SidebarLink to='/logout'
                                         icon={<span
                                             className="glyphicon glyphicon-log-out"/>}
                                         text={'Logout'}
                            />
                        </div>)
                        : null};
                </ul>
            </div>
        </div>;
    }
}

export default Sidebar;
