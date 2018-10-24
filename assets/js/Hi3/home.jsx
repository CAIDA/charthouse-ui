import React from 'react';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import hi3Logo from 'images/logos/hicube-full.png';

import 'Hi3/css/home.css';

import LinkButton from 'utils/link-button';

class Home extends React.Component {
    render() {
        return <div className='container'>
            <div className="jumbotron">
                <h1>
                    <img id="hi3-logo" src={ hi3Logo }/>
                    <img id="caida-logo" src={caidaLogo}/>
                </h1>
                <p className="lead">
                    <i>
                        A CAIDA project to develop an operational prototype
                        system that
                        monitors the Internet, in near-realtime, to
                        identify macroscopic Internet outages affecting the edge
                        of the
                        network, i.e., significantly impacting an AS or a large
                        fraction of
                        a country.
                    </i>
                </p>
            </div>
            <div className='row text-center'>
                <LinkButton bsStyle="primary" bsSize="large" to='/explorer'>
                    Sign in to Hi³
                </LinkButton>
            </div>
        </div>;
    }
}

export default Home;
