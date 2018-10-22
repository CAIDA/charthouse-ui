import React from 'react';
import { Redirect } from 'react-router-dom';

import { auth } from 'Auth';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // 1. if we are already logged in, just redirect
        // TODO: allow redirect location to be set by caller (passed to us from AuthenticatedRoute or directly)
        if (auth.isAuthenticated()) {
            return <Redirect to='/explorer'/>;
        }

        // 2. otherwise, ask the auth service to log in
        auth.login();
        // even though the login is async, it's a better experience if we
        // render nothing
        return null;
    }
}

export default LoginPage;
