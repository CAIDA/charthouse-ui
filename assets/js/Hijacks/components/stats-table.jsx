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

import PropTypes from 'prop-types';
import React from 'react';

import DataApi from '../connectors/data-api';
import {eventTypeName} from '../utils';
import {humanizeBytes, humanizeNumber} from 'Hi3/utils';

import 'Hijacks/css/components/stats-table.css';

class StatsRow extends React.Component {

    static propTypes = {
        eventType: PropTypes.string.isRequired
    };

    refreshTimer = null;

    constructor(props) {
        super(props);
        this.api = new DataApi();
        this.state = {
            stats: null
        };

    }

    componentDidMount() {
        this._getStats(this.props.eventType);
    }

    componentWillReceiveProps(newProps) {
        this._getStats(newProps.eventType);
    }

    componentWillUnmount() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    render() {
        const stats = this.state.stats;
        if (!stats || !stats.today || !stats.total) {
            // don't render anything while stats are first loading
            return null;
        }
        const name = stats.eventType !== 'all'
            ? eventTypeName(stats.eventType)
            : '';
        return <div className='row text-center panel-body'>
            <div className='row'>
                <div className='col-md-4 data-stat'>
                    <div className='data-stat-number'>
                        {stats.today.count.toLocaleString()}
                    </div>
                    <div className='data-stat-caption'>
                        Suspicious {name} Events Today
                    </div>
                </div>
                <div className='col-md-4 data-stat'>
                    <div className='data-stat-number'>
                        {this._formatValue(stats.total.count)}
                    </div>
                    <div className='data-stat-caption'>
                        Suspicious {name} Events
                    </div>
                </div>
                <div className='col-md-4 data-stat'>
                    <div className='data-stat-number'>
                        {this._formatValue(stats.total.bytes, true)}
                    </div>
                    <div className='data-stat-caption'>
                        {name} Dataset Size
                    </div>
                </div>
            </div>
        </div>
    }

    _formatValue(value, isBytes) {
        return isBytes ? humanizeBytes(value) : humanizeNumber(value);
    }

    _getStats(eventType) {
        this.api.getStats(eventType, this._parseStats);
        if (!this.refreshTimer) {
            this.refreshTimer = setTimeout(() => {
                this.refreshTimer = null;
                this.api.getStats(this.props.eventType, this._parseStats);
            }, 60 * 1000);
        }
    }

    _parseStats = (stats) => {
        stats.data.eventType = this.props.eventType;
        this.setState({stats: stats.data});
    };
}

class StatsTable extends React.Component {

    static propTypes = {
        eventType: PropTypes.string
    };

    static defaultProps = {
        eventType: 'all'
    };

    render() {
        return <div className='hijacks-statstable panel panel-default'>
            <StatsRow eventType='all'/>
            {this.props.eventType !== 'all' ? <StatsRow eventType={this.props.eventType}/> : null }
        </div>
    }
}

export default StatsTable;
