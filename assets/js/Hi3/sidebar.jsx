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

import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'react-router-dom';
import titleCase from 'title-case';

import {auth} from 'Auth';

import 'Hi3/css/sidebar.css';

// TODO: properly support mobile

class SidebarLink extends React.Component {

    static propTypes = {
        isBrand: PropTypes.bool,
        page: PropTypes.string,
        icon: PropTypes.node.isRequired,
        onClick: PropTypes.func.isRequired,
        text: PropTypes.node
    };

    render() {
        const text = this.props.text || titleCase(this.props.page);
        return <li className={this.props.isBrand ? 'brand' : null}>
            <NavLink to={`/${this.props.isBrand ? '' : this.props.page}`}
                     onClick={this.props.onClick}>
                <div className="icon">{this.props.icon}</div>
                <div className="text">{text}</div>
            </NavLink>
        </li>;
    }
}

class Sidebar extends React.Component {

    static propTypes = {
        links: PropTypes.arrayOf(PropTypes.object).isRequired,
        isPinned: PropTypes.bool
    };

    static defaultProps = {
        isPinned: false
    };

    state = {
        authenticated: false,
        isExpanded: false
    };

    authpromise = null;

    constructor(props) {
        super(props);

        this.authpromise = auth.makeCancelable(auth.callSilentInit());
        this.authpromise.promise.then(authed => {
            this.setState({authenticated: authed})
        });
    }

    componentWillUnmount() {
        if (this.authpromise) {
            this.authpromise.cancel();
        }
    }

    render() {
        const collapsed = (!this.props.isPinned && !this.state.isExpanded) ?
            'sidebar-collapsed' : '';
        return <div>
            <div className={`sidebar ${collapsed}`}
                 onMouseOver={!this.props.isPinned ? this.onHover : null}
                 onMouseOut={!this.props.isPinned ? this.onLeave : null}
            >
                <ul>
                    {this.props.links.map((link, idx) => {
                        return link ?
                            <SidebarLink key={idx} onClick={this.onLeave} {...link}/> :
                            <div className='sidebar-separator' key={idx}/>;
                    })}
                    {this.state.authenticated ?
                        (<div className='pull-bottom'>
                            <SidebarLink onClick={this.onLeave}
                                         page='user/profile'
                                         icon={<span
                                             className="glyphicon glyphicon-user"/>}
                                         text={<div>Logged in
                                             as <i>{auth.getNickname()}</i></div>}
                            />
                            <SidebarLink onClick={this.onLeave}
                                         page='logout'
                                         icon={<span
                                             className="glyphicon glyphicon-log-out"/>}
                            />
                        </div>)
                        :
                        (<div className='pull-bottom'>
                            <SidebarLink onClick={this.onLeave}
                                         page='login'
                                         icon={<span
                                             className="glyphicon glyphicon-log-in"/>}
                            />
                        </div>)
                        };
                </ul>
            </div>
        </div>;
    }

    onHover = () => {
        this.setState({isExpanded: true});
    };

    onLeave = () => {
        this.setState({isExpanded: false});
    };
}

export default Sidebar;
