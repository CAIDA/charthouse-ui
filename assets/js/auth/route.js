import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { auth } from 'Auth';

class AuthenticatedRoute extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { component, ...props } = this.props;
        if (!auth.isAuthenticated()) {
            return <Route {...props}>
                <Redirect to='/login'/>
            </Route>;
        }
        return <Route component={component} {...props}/>
    }
}

export default AuthenticatedRoute;
