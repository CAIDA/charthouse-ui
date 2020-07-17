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

import {HI3} from 'Hi3/utils';

import 'Hi3/css/pages/feeds/hijacks.css';
import EventsTable from "../../../../Hijacks/components/events-table";

const HORIZONTAL_OFFSET = 480;

class EventsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventType: 'moas',
            vizType: 'feed',
            frameWidth: window.innerWidth - HORIZONTAL_OFFSET
        };

    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {

        return <div id='hijacks' className='container-fluid'>
            <div className='row header'>
                <div className='col-md-12 page-header'>
                    <h1>BGP Hijacks Observatory</h1>
                    <p className='lead'>
                        The <a href="https://www.caida.org/funding/hijacks">BGP Hijacks Observatory</a> is
                        a <a href="https://www.caida.org">CAIDA</a> project
                        to detect and characterize BGP hijacking attacks,
                        including stealthy man-in-the-middle (MiTM) Internet
                        traffic interception attacks. The Observatory uses
                        the <Link to='/feeds'>{HI3} PaaS</Link> offering
                        to power its data collection and
                        analytics platform, and provides event data to {HI3} to
                        allow correlation with other types of Internet
                        security data.
                    </p>
                </div>
            </div>

            <EventsTable/>

        </div>;
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };

    _changeVizType = (e) => {
        this.setState({vizType: e.target.id});
    };

    _typeChanged = (eventType) => {
        this.setState({eventType});
    };
}

export default EventsList;
