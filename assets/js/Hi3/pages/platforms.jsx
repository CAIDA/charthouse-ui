import React from 'react';

import {Tile, TileGrid} from '../components/tile-grid';

import hijacksThumb from 'images/logos/hicube-icon.png';
import iodaThumb from 'images/logos/hicube-icon.png';
import mapkitThumb from 'images/logos/hicube-icon.png';
import barfordThumb from 'images/logos/hicube-icon.png';

class Platforms extends React.Component {
    render() {
        return <div className='container'>
            <h1>Event Platforms</h1>
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
                      title='Internet Outages Detection and Analysis (IODA)'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Tile>
                <Tile to='/platforms/mapkit' thumb={mapkitThumb}
                      title='Mapping Key Internet Terrain (MAPKIT)'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Tile>
                <Tile to='/platforms/barford' thumb={barfordThumb}
                      title='Paul Barford'>
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
