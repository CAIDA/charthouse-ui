/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

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
                        {HI3} provides access to several data feeds and
                        analytics projects allowing (secure) correlation between
                        various types of Internet incident data. Data providers
                        can also leverage the {HI3} PaaS backend infrastructure
                        (data collection, ingestion, storage and analysis)
                        as well as its SaaS frontend interfaces and UI components to
                        rapidly build, scale and expose their Internet data
                        and analytics project.
                    </p>
                </div>
            </div>
            <TileGrid>
                <Tile to='/feeds/hijacks/events' thumb={hijacksThumb} forceA={true}
                      title='BGP Hijacks Observatory'>
                    The BGP Hijacks Observatory is a CAIDA project to detect
                    and characterize BGP hijacking attacks, including stealthy
                    man-in-the-middle (MiTM) Internet traffic interception attacks.
                </Tile>
                <Tile to='https://ioda.caida.org' thumb={iodaThumb}
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
