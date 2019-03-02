import React from 'react';

import {Tile, TileGrid} from '../components/tile-grid';

import hijacksThumb from 'images/thumbs/hijacks.png';
import iodaThumb from 'images/logos/ioda-logo-brand.svg';
import mapkitThumb from 'images/logos/hicube-icon.png';
import ucsdntThumb from 'images/logos/hicube-icon.png';
import meritntThumb from 'images/logos/hicube-icon.png';

class Platforms extends React.Component {
    render() {
        return <div className='container'>
            <div className="page-header">
                <h1>Event Platforms</h1>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <p className='lead' style={{marginBottom: '30px'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
            </div>
            <TileGrid>
                <Tile to='/platforms/hijacks' thumb={hijacksThumb}
                      title='BGP Hijacks Observatory'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Tile>
                <Tile to='/platforms/ioda' thumb={iodaThumb}
                      isScreenshot={false}
                      title='Internet Outages Detection and Analysis (IODA)'>
                    A CAIDA project to develop an operational prototype system
                    that monitors the Internet, in near-realtime, to identify
                    macroscopic Internet outages affecting the edge of the
                    network, i.e., significantly impacting an AS or a large
                    fraction of a country.
                </Tile>
                <Tile to='/platforms/mapkit' thumb={mapkitThumb}
                      isScreenshot={false}
                      title='Mapping Key Internet Terrain (MapKIT)'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Tile>
                <Tile to='/platforms/ucsdnt' thumb={ucsdntThumb}
                      isScreenshot={false}
                      title='UCSD Network Telescope'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Tile>
                <Tile to='/platforms/meritnt' thumb={meritntThumb}
                      isScreenshot={false}
                      title='Merit Network Telescope'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Tile>
            </TileGrid>
        </div>;
    }
}

export default Platforms;
