import React from 'react';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import hi3Logo from 'images/logos/hicube-full.png';
import explorerThumb from 'images/logos/hicube-icon.png';
import dashboardThumb from 'images/logos/hicube-icon.png';
import examplesThumb from 'images/logos/hicube-icon.png';
import platformsThumb from 'images/logos/hicube-icon.png';

import 'Hi3/css/home.css';
import {TileGrid} from './components/tile-grid';

class InterfaceTiles extends React.Component {
    render() {
        return <TileGrid title='Data Investigation Interfaces'>
            <Link to="/explorer">
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
            </Link>
            <Link to="/platforms">
                <div className="col-md-4">
                    <div className="thumbnail">
                        <img src={platformsThumb}/>
                        <div className="caption text-center">
                            <h4>
                                Event Platforms
                            </h4>
                            <p>
                                A collection of interfaces and dashboards
                                tailored for specific types of Internet security
                                events, including BGP Hijacking, and Large-scale
                                outages.
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
            <Link to="/dashboards">
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
            </Link>
            <Link to="/examples">
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
            </Link>
        </TileGrid>;
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
