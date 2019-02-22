import React from 'react';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import hi3Logo from 'images/logos/hicube-full.png';
import explorerThumb from 'images/logos/hicube-icon.png';
import dashboardThumb from 'images/logos/hicube-icon.png';
import examplesThumb from 'images/logos/hicube-icon.png';

import 'Hi3/css/home.css';

class InterfaceTiles extends React.Component {
    render() {
        return <div>
            <h3>Data Interfaces</h3>
        <div className="row row-thumbs">
            <a href="/explorer">
                <div className="col-md-4">
                    <div className="thumbnail">
                        <img src={explorerThumb}/>
                        <div className="caption text-center">
                            <h4>
                                Time Series Explorer
                            </h4>
                            <p>
                                Interface for exploratory analysis of Internet security time
                                series. Allows researchers to
                                build custom visualizations by composing time
                                series
                                together using specialized post-processing
                                functions.
                            </p>
                        </div>
                    </div>
                </div>
            </a>
            <a href="/dashboards">
                <div className="col-md-4">
                    <div className="thumbnail">
                        <img src={dashboardThumb}/>
                        <div className="caption text-center">
                            <h4>
                                Live Dashboards
                            </h4>
                            <p>
                                Interface for exploratory analysis of Internet
                                security time
                                series. Allows researchers to
                                build custom visualizations by composing time
                                series
                                together using specialized post-processing
                                functions.
                            </p>
                        </div>
                    </div>
                </div>
            </a>
            <a href="/examples">
                <div className="col-md-4">
                    <div className="thumbnail">
                        <img src={examplesThumb}/>
                        <div className="caption text-center">
                            <h4>
                                Sample Analyses
                            </h4>
                            <p>
                                Interface for exploratory analysis of Internet
                                security time
                                series. Allows researchers to
                                build custom visualizations by composing time
                                series
                                together using specialized post-processing
                                functions.
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        </div>;
    }
}

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
            <InterfaceTiles/>
        </div>;
    }
}

export default Home;
