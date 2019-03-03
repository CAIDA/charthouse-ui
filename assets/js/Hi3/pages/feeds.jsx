import React from 'react';

import {Tile, TileGrid} from 'Hi3/components/tile-grid';
import {HI3} from 'Hi3/utils';

import hijacksThumb from 'images/thumbs/hijacks.png';
import iodaThumb from 'images/logos/ioda-logo-brand.svg';
import mapkitThumb from 'images/logos/hicube-icon.png';
import ucsdntThumb from 'images/logos/hicube-icon.png';
import meritntThumb from 'images/logos/hicube-icon.png';
import thunderpingThumb from 'images/logos/hicube-icon.png';

class Feeds extends React.Component {
    render() {
        return <div className='container'>
            <div className="page-header">
                <h1>Data Feeds &amp; Analytics</h1>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <p className='lead' style={{marginBottom: '30px'}}>
                        {HI3}'s PaaS and SaaS model provides a win-win
                        opportunity for data and analytics providers. Providers
                        can leverage the backend infrastructure
                        (data collection, ingestion, storage and analysis)
                        as well as frontend interfaces and UI components to
                        rapidly build, scale and expose their Internet data
                        and analytics project. In addition, the data and
                        analytics that they develop can then be (securely)
                        correlated with data from other providers within
                        the {HI3} community.
                    </p>
                </div>
            </div>
            <TileGrid>
                <Tile to='/feeds/hijacks' thumb={hijacksThumb}
                      title='BGP Hijacks Observatory'>
                    The BGP Hijacks Observatory is a CAIDA project to detect
                    and characterize BGP hijacking attacks, including stealthy
                    man-in-the-middle (MiTM) Internet traffic interception attacks.
                </Tile>
                <Tile to='/feeds/ioda' thumb={iodaThumb}
                      isScreenshot={false}
                      title='Internet Outages Detection and Analysis (IODA)'>
                    A CAIDA project to develop an operational prototype system
                    that monitors the Internet, in near-realtime, to identify
                    macroscopic Internet outages affecting the edge of the
                    network, i.e., significantly impacting an AS or a large
                    fraction of a country.
                </Tile>
                <Tile to='/feeds/mapkit' thumb={mapkitThumb}
                      isScreenshot={false}
                      title='Mapping Key Internet Terrain (MapKIT)'>
                    MapKIT seeks to identify important components of the Internet topology of a
                    country/region&mdash;Autonomous Systems (ASes), Internet
                    Exchange Points (IXPs), PoPs, colocation facilities, and
                    physical cable systems which represent the &ldquo;key terrain&rdquo; in
                    cyberspace.
                </Tile>
                <Tile to='/feeds/ucsdnt' thumb={ucsdntThumb}
                      isScreenshot={false}
                      title='UCSD Network Telescope'>
                    The UCSD Network Telescope (UCSD-NT) is a passive monitoring
                    system, which captures unsolicited Internet traffic sent to
                    a large segment of unassigned IPv4 address space and
                    provides a unique global view of macroscopic Internet
                    phenomena. Data from UCSD-NT has been used to study network
                    and systems security and stability, machine learning and
                    big data processing techniques, and, most recently, for
                    studies of cyberwarfare and political repression of communication
                </Tile>
                <Tile to='/feeds/meritnt' thumb={meritntThumb}
                      isScreenshot={false}
                      title='Merit Network Telescope'>
                    The Merit Network Telescope (Merit-NT) is ipsum dolor sit
                    amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Tile>
                <Tile to='/feeds/thunderping' thumb={thunderpingThumb}
                      isScreenshot={false}
                      title='Thunderping'>
                    Thunderping is a project from the University of Maryland
                    that investigates the resilience of residential Internet
                    connections during and after weather events.
                    When the National Weather Service issues a
                    weather alert for a county in the United States, they ping IP
                    addresses belonging to residential Internet connections in
                    that county, before, during, and after the alert.
                </Tile>
            </TileGrid>
        </div>;
    }
}

export default Feeds;
