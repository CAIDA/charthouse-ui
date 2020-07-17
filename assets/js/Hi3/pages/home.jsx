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
import {Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap';

import {Tile, TileGrid} from '../components/tile-grid';
import {HI3} from '../utils';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import hi3Logo from 'images/logos/hicube-full.png';
import explorerThumb from 'images/thumbs/explorer.png';
import dashboardThumb from 'images/thumbs/dashboards.png';
import examplesThumb from 'images/logos/hicube-icon.png'; // TODO add thumb
import feedsThumb from 'images/thumbs/feeds.png';

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
            <Tile to='/feeds' thumb={feedsThumb}
                  title='Data Feeds &amp; Analytics'>
                External projects that leverage the {HI3} platform to
                detect and analyze specific types of Internet security
                events, including BGP Hijacking, and large-scale outages.
            </Tile>
            <Tile to='/dashboards' thumb={dashboardThumb}
                  title='Live Dashboards'>
                Pre-configured dashboards tailored for real-time monitoring of
                Internet dynamics and events.
            </Tile>
            <Tile to='/examples' thumb={examplesThumb} isScreenshot={false}
                  title='Event Analyses'>
                Detailed blog-style post-event analyses created using data
                and visualizations provided by the {HI3} platform.
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
                        A prototype platform for processing, storing,
                        investigating, and correlating diverse streams of
                        large-scale Internet security-related data.
                    </i>
                </p>
            </div>
            <Alert bsStyle="danger">
                <p className='lead'>
                    <strong>{HI3} is still under heavy development.</strong>
                    <br/>
                    This is a preview version of {HI3}. Much of the content,
                    and many features are either missing or work-in-progress.
                </p>
            </Alert>
            <p className='lead'>
                Welcome to {HI3}, a <a href="https://www.caida.org">
                CAIDA</a> project
                to lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua.
                If this is your first time using {HI3}, then you might want to
                take a look at the
                <Link to='/quickstart'> Quickstart Guide </Link> and
                <Link to='/docs'> Documentation </Link>.
            </p>
            <InterfaceTiles/>
        </div>;
    }
}

export default Home;
