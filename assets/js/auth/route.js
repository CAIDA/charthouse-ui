import React from 'react';
import { Route, Redirect } from 'react-router-dom';

class AuthenticatedRoute extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { auth, children, ...props } = this.props;
        return <Route {...props}>
            {auth.isAuthenticated ? children : <Redirect to='/login'/>}
        </Route>
    }
}

export default AuthenticatedRoute;
