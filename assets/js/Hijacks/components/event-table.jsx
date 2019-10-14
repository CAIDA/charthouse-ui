import PropTypes from 'prop-types';
import React from 'react';
import Iframe from "react-iframe";

class EventTable extends React.Component {
    static propTypes = {
        eventType: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
    };

    render() {
        return this._embed()
    }

    _embed() {
        const url = `//bgp.caida.org/hi3/${this.props.eventType}`;
        return <div className='row' style={{margin: 0}}>
            <Iframe
                url={url}
                width={this.props.width}
                height={this.props.height}
            />
        </div>
    }
}

export default EventTable;