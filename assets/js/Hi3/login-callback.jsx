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

import React from 'react';
import { Redirect } from 'react-router-dom';

import { auth } from 'Auth';

class LoginCallbackPage extends React.Component {

    state = {
        handlingCallback: true,
        error: null
    };

    constructor(props) {
        super(props);
        this._loginSuccess = this._loginSuccess.bind(this);
        this._loginError = this._loginError.bind(this);
    }

    componentDidMount() {
    }

    render() {
        // 1. if we're authenticated, then redirect!
        if (auth.isAuthenticated()) {
            const dest = sessionStorage.getItem('redirect_uri') || '/';
            sessionStorage.removeItem('redirect_uri');
            if (!dest.startsWith('http')) {
                return <Redirect to={dest}/>
            }
            location.href = dest;
            return null;
        }

        // 1. if we are processing a callback
        if (this.state.handlingCallback) {
            // TODO: make this message prettier (w. spinner)
            return <p>Please wait..</p>;
        }

        // 2. did we get an error when logging in?
        if (this.state.error) {
            auth.forceLogin();
            // TODO: better error page and message
            // can this be caused by user error?
            return <p>Authentication failed. Please wait...</p>;
        }

        // 3. not authenticated, no callback, no error message, so this is an error
        // TODO: what to do in this case?
        // consider redirecting to home
        return <p>Invalid authentication state. Please retry</p>;
    }

    _loginSuccess() {
        this.setState({
            handlingCallback: false
        });
    }

    _loginError(err) {
        this.setState({
            handlingCallback: false,
            error: err
        });
    }
}

export default LoginCallbackPage;
