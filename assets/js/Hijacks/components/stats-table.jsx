import PropTypes from 'prop-types';
import React from 'react';

import DataApi from '../connectors/data-api';
import {eventTypeName} from '../utils';
import {humanizeBytes, humanizeNumber} from 'Hi3/utils';

import 'Hijacks/css/components/stats-table.css';

class StatsTable extends React.Component {

    static propTypes = {
        eventType: PropTypes.string
    };

    static defaultProps = {
        eventType: 'all'
    };

    state = {
        stats: null
    };

    constructor(props) {
        super(props);
        this.api = new DataApi();
    }

    componentDidMount() {
        this._getStats(this.props.eventType);
    }

    componentWillReceiveProps(newProps) {
        this._getStats(newProps.eventType);
    }

    render() {
        const stats = this.state.stats;
        if (!stats || !stats.today || !stats.total) {
            // don't render anything while stats are first loading
            return null;
        }
        const name = this.state.stats.eventType !== 'all'
            ? eventTypeName(this.state.stats.eventType)
            : '';
        return <div className='hijacks-statstable'>
            <div className='row text-center'>
                <div className='col-md-6 data-stat'>
                    <div className='data-stat-number'>
                        {this._formatValue(stats.total.count)}
                    </div>
                    <div className='data-stat-caption'>
                        {name} Events
                    </div>
                </div>
                <div className='col-md-6 data-stat'>
                    <div className='data-stat-number'>
                        {this._formatValue(stats.total.bytes, true)}
                    </div>
                    <div className='data-stat-caption'>
                        {name} Bytes
                    </div>
                </div>
            </div>
            <div className='row text-center'>
                <div className='col-md-6 data-stat'>
                    <div className='data-stat-number'>
                        {this._formatValue(stats.today.count)}
                    </div>
                    <div className='data-stat-caption'>
                        {name} Events Today
                    </div>
                </div>
                <div className='col-md-6 data-stat'/>
            </div>
        </div>
    }

    _formatValue(value, isBytes) {
        return isBytes ? humanizeBytes(value) : humanizeNumber(value);
    }

    _getStats(eventType) {
        this.api.getStats(eventType, this._parseStats);
    }

    _parseStats = (stats) => {
        stats.data.eventType = this.props.eventType;
        this.setState({stats: stats.data});
    };
}

export default StatsTable;
