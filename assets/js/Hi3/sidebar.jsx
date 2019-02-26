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
                    <li className="brand">
                        <NavLink to="/">
                            <div className="icon"><img src={hicubeLogo} /></div>
                            <div className="text"><img src={hicubeLogoText}/></div>
                        </NavLink>
                    </li>

                    <div className='sidebar-separator'/>

                    <li>
                        <NavLink to="/quickstart">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-flash"/>
                            </div>
                            <div className="text">
                                Quickstart
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/docs">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-education"/>
                            </div>
                            <div className="text">
                                Documentation
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">
                            <div className="icon">
                                <span className="glyphicon glyphicon-info-sign"/>
                            </div>
                            <div className="text">
                                About Hi³
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/acks">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-thumbs-up"/>
                            </div>
                            <div className="text">
                                Acknowledgements
                            </div>
                        </NavLink>
                    </li>

                    <div className='sidebar-separator'/>

                    <li>
                        <NavLink to="/explorer">
                            <div className="icon">
                                <span className="glyphicon glyphicon-equalizer"/>
                            </div>
                            <div className="text">
                                Time Series Explorer
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboards">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-dashboard"/>
                            </div>
                            <div className="text">
                                Live Dashboards
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/examples">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-heart"/>
                            </div>
                            <div className="text">
                                Sample Analyses
                            </div>
                        </NavLink>
                    </li>

                    {auth.isAuthenticated() ?
                        (<div className='pull-bottom'>
                        <li>
                            <NavLink to='/user/profile'>
                                <div className="icon">
                                    <span className="glyphicon glyphicon-user"/>
                                </div>
                                <div className='text username'>
                                    Logged in as <i>{auth.getNickname()}</i>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/logout'>
                                <div className="icon">
                                    <span
                                        className="glyphicon glyphicon-log-out"/>
                                </div>
                                <div className='text logout'>
                                    Logout
                                </div>
                            </NavLink>
                        </li>
                    </div>) : null};
                </ul>
            </div>
        </div>;
    }
}

export default Sidebar;
