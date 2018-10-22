import React from 'react';

import { auth } from 'Auth';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // TODO: here
        // 1. is this an auth callback?
        //    yes: handle it and redirect (handle errors)
        // 2. call the signin method, then render a "logging in..." message
        // ... need to figure out how to detect redirect back from auth (either login or renew)
        auth.login();

        return <p>Redirecting to authentication provider...</p>
    }
}

export default LoginPage;
