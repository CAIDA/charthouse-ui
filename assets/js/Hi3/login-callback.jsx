import React from 'react';
import { Redirect } from 'react-router-dom';

import { auth } from 'Auth';

class LoginCallbackPage extends React.Component {

    state = {
        handlingCallback: false,
        error: null
    };

    constructor(props) {
        super(props);
        this._loginSuccess = this._loginSuccess.bind(this);
        this._loginError = this._loginError.bind(this);

        // this page should only be triggered by auth0
        if (/access_token|id_token|error/.test(props.location.hash)) {
            this.state.handlingCallback = true;
            auth.handleAuthentication(this._loginSuccess, this._loginError);
        }
    }

    render() {
        // 1. if we're authenticated, then redirect!
        if (auth.isAuthenticated()) {
            return <Redirect to='/explorer'/>
        }

        // 1. if we are processing a callback
        if (this.state.handlingCallback) {
            return <p>TODO: loading user information</p>;
        }

        // 2. did we get an error when logging in?
        if (this.state.error) {
            return <p>Authentication failed: {this.state.error} (TODO: FIXME)</p>;
        }

        // 3. not authenticated, no callback, no error message, so this is an error
        // TODO: what to do in this case?
        return <p>Invalid callback state (TODO: consider redirecting to home)</p>;
    }

    _loginSuccess() {
        this.setState({
            handlingCallback: false
        });
    }

    _loginError(errMsg) {
        this.setState({
            handlingCallback: false,
            error: errMsg
        });
    }
}

export default LoginCallbackPage;
