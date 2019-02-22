import React from 'react';
import {Link} from 'react-router-dom';

import {auth} from 'Auth';

import 'Hi3/css/sidebar.css';
import hicubeLogo from 'images/logos/hicube-icon-white.png';
import hicubeLogoText from 'images/logos/hicube-text-white.png';

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
                        <a href="/">
                            <div className="icon"><img src={hicubeLogo} /></div>
                            <div className="text"><img src={hicubeLogoText}/></div>
                        </a>
                    </li>

                    <div className='sidebar-separator'/>

                    <li>
                        <a href="/quickstart">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-flash"/>
                            </div>
                            <div className="text">
                                Quickstart
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="/docs">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-education"/>
                            </div>
                            <div className="text">
                                Documentation
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="/about">
                            <div className="icon">
                                <span className="glyphicon glyphicon-info-sign"/>
                            </div>
                            <div className="text">
                                About Hi³
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="/acks">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-thumbs-up"/>
                            </div>
                            <div className="text">
                                Acknowledgements
                            </div>
                        </a>
                    </li>

                    <div className='sidebar-separator'/>

                    <li>
                        <a href="/explorer">
                            <div className="icon">
                                <span className="glyphicon glyphicon-equalizer"/>
                            </div>
                            <div className="text">
                                Time Series Explorer
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="/dashboards">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-dashboard"/>
                            </div>
                            <div className="text">
                                Live Dashboards
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="/examples">
                            <div className="icon">
                                <span
                                    className="glyphicon glyphicon-heart"/>
                            </div>
                            <div className="text">
                                Sample Analyses
                            </div>
                        </a>
                    </li>

                    {auth.isAuthenticated() ?
                        (<div className='pull-bottom'>
                        <li>
                            <a href='/user/profile'>
                                <div className="icon">
                                    <span className="glyphicon glyphicon-user"/>
                                </div>
                                <div className='text username'>
                                    Logged in as <i>{auth.getNickname()}</i>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/logout'>
                                <div className="icon">
                                    <span
                                        className="glyphicon glyphicon-log-out"/>
                                </div>
                                <div className='text logout'>
                                    Logout
                                </div>
                            </a>
                        </li>
                    </div>) : null};
                </ul>
            </div>
        </div>;
    }
}

export default Sidebar;
