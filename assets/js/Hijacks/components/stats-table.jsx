import PropTypes from 'prop-types';
import React from 'react';

import DataApi from '../connectors/data-api';

import 'Hijacks/css/components/stats-table.css';

class StatsTable extends React.PureComponent {

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
        this._getStats(this.props.eventType);
    }

    render() {
        const stats = this.state.stats;
        if (!stats || !stats.today || !stats.total) {
            // don't render anything while stats are first loading
            return null;
        }
        return <div className='hijacks-statstable'>
            <div className='row text-center'>
                <div className='col-md-6 data-stat'>
                    <div className='data-stat-number'>
                        {stats.today.count}
                    </div>
                    <div className='data-stat-caption'>
                        Events Today
                    </div>
                </div>
                <div className='col-md-6 data-stat'/>
            </div>
            <div className='row text-center'>
                <div className='col-md-6 data-stat'>
                    <div className='data-stat-number'>
                        {stats.total.count}
                    </div>
                    <div className='data-stat-caption'>
                        Events Total
                    </div>
                </div>
                <div className='col-md-6 data-stat'>
                    <div className='data-stat-number'>
                        {stats.total.bytes}
                    </div>
                    <div className='data-stat-caption'>
                        Bytes Total
                    </div>
                </div>
            </div>
        </div>
    }

    _getStats(eventType) {
        this.api.getStats(eventType, this._parseStats);
    }

    _parseStats = (stats) => {
        this.setState({stats: stats.data});
    };
}

export default StatsTable;
