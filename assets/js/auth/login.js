import React from 'react';
import { Redirect } from 'react-router-dom';

import { auth } from 'Auth';

class LoginPage extends React.Component {

    state = {
        isAuthenticated: auth.isAuthenticated
    };

    constructor(props) {
        super(props);
        this._login = this._login.bind(this);
    }


    render() {
        // no need to log in if we already are
        if (this.state.isAuthenticated) {
            // TODO: remember where we were going, otherwise go home
            return <Redirect to='/explorer'/>;
        }

        return <div>
            <p>You need to <a href="javascript:void(0)" onClick={this._login}>log in</a></p>
        </div>
    }

    _login() {
        auth.authenticate();
        this.setState({isAuthenticated: auth.isAuthenticated});
    }
}

export default LoginPage;
