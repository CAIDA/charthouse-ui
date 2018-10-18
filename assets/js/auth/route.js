import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { auth } from 'Auth';

class AuthenticatedRoute extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { children, ...props } = this.props;
        return <Route {...props}>
            {auth.isAuthenticated ? children : <Redirect to='/login'/>}
        </Route>
    }
}

export default AuthenticatedRoute;
