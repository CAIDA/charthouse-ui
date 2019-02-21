import React from 'react';
import {Link} from 'react-router-dom';

import 'Hi3/css/sidebar.css';
import hicubeLogo from 'images/logos/hicube-icon-white.png';

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
                            <div className="text">HI-CUBE</div>
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
                        <a href="/explorer">
                            <div className="icon">
                                <span className="glyphicon glyphicon-equalizer"/>
                            </div>
                            <div className="text">
                                Time Series Explorer
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>;
    }
}

export default Sidebar;
