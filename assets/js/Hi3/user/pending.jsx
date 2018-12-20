import React from 'react';

import { auth } from 'Auth';

class PendingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <p>Your account is pending administrator approval.</p>
    }

}

export default PendingPage;
