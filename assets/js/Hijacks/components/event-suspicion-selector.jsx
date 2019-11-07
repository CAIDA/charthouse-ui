import PropTypes from 'prop-types';
import React from 'react';
import {ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

class EventSuspicionSelector extends React.Component {

    static propTypes = {
        eventSuspicionLevel: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        eventSuspicionLevel: 'suspicious',
        onChange: ()=>{}
    };

    render() {
        return <div style={{display: 'inline-block'}}>
            <label style={{display: 'block'}}>
                Select an event suspicion level
            </label>
            {/* onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734 */}
            <ToggleButtonGroup type="radio" name="eventSuspicionLevel"
                               value={this.props.eventSuspicionLevel}
                               onChange={this._changeEventSuspicionLevel}
            >
                <ToggleButton value='all' id='all'
                              onClick={this._changeEventSuspicionLevel}>All</ToggleButton>
                <ToggleButton value='suspicious' id='suspicious'
                              onClick={this._changeEventSuspicionLevel}>Suspicious</ToggleButton>
                <ToggleButton value='grey' id='grey'
                              onClick={this._changeEventSuspicionLevel}>Grey</ToggleButton>
                <ToggleButton value='benign' id='benign'
                              onClick={this._changeEventSuspicionLevel}>Benign</ToggleButton>
            </ToggleButtonGroup>
        </div>
    }

    _changeEventSuspicionLevel = (e) => {
        console.log(`suspicion changes: ${e.target.id}`);
        this.props.onChange(e.target.id);
    };
}

export default EventSuspicionSelector;
