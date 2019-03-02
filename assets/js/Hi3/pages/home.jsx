import React from 'react';

import {Tile, TileGrid} from '../components/tile-grid';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import hi3Logo from 'images/logos/hicube-full.png';
import explorerThumb from 'images/thumbs/explorer.png';
import dashboardThumb from 'images/logos/hicube-icon.png'; // TODO add thumb
import examplesThumb from 'images/logos/hicube-icon.png'; // TODO add thumb
import platformsThumb from 'images/thumbs/platforms.png';

import 'Hi3/css/pages/home.css';

class InterfaceTiles extends React.Component {
    render() {
        return <TileGrid title='Data Investigation Interfaces'>
            <Tile to='/explorer' thumb={explorerThumb}
                  title='Time Series Explorer'>
                Interface for exploratory analysis of Internet security time
                series. Allows researchers to
                build custom visualizations by composing time
                series
                together using specialized post-processing
                functions.
            </Tile>
            <Tile to='/platforms' thumb={platformsThumb}
                  title='Event Platforms'>
                A collection of interfaces and dashboards
                tailored for specific types of Internet security
                events, including BGP Hijacking, and Large-scale
                outages.
            </Tile>
            <Tile to='/dashboards' thumb={dashboardThumb}
                  title='Live Dashboards'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit
                esse cillum dolore eu fugiat nulla pariatur.
            </Tile>
            <Tile to='/examples' thumb={examplesThumb}
                  title='Sample Event Analyses'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit
                esse cillum dolore eu fugiat nulla pariatur.
            </Tile>
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </i>
                </p>
            </div>
            <p className='lead'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit
                esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <InterfaceTiles/>
        </div>;
    }
}

export default Home;
