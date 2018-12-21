import React from 'react';

import { auth } from 'Auth';
import hi3Logo from 'images/logos/hicube-full.png';

class PendingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className='container'>
            <div className="jumbotron">
                <h1>
                    <img id="hi3-logo" src={hi3Logo}/>
                    <p><span style={{fontSize: '100px'}}
                             className='glyphicon glyphicon-bullhorn'/></p>
                </h1>
            </div>
            <div className='row text-center'>
                <p className='lead'>
                    Hello, {auth.getName()}.
                    <br/>
                    You have successfully signed into Hi³, but your
                    account has not yet been approved by an administrator.
                    <br/>
                    If you think you are seeing this page in error, please
                    contact <a href='mailto:hicube-info@caida.org'>
                    hicube-info.caida.org</a>.
                </p>
            </div>
        </div>;
    }

}

export default PendingPage;
