import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return <div>
            <p>Welcome to Hi3</p>
            <Link to='/login'>Log in</Link>
            <br/>
            <Link to='/logout'>Log out</Link>
        </div>;
    }
}

export default Home;
