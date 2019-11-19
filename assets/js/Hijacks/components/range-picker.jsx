import PropTypes from 'prop-types';
import React from 'react';
import {ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";

class RangePicker extends React.Component {

    constructor(props){
        super(props);
        this.ranges = {
            'Today': [
                moment().startOf('day').utc(true),
                moment().utc(true)
            ],
            'Yesterday': [
                moment().subtract(2, 'days').startOf('day').utc(true),
                moment().subtract(1, 'days').startOf('day').utc(true)
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days').startOf('day').utc(true),
                moment().utc(true)
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days').startOf('day').utc(true),
                moment().utc(true)
            ],
            'This Month': [
                moment().startOf('month').utc(true),
                moment().endOf('month').utc(true)
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month').utc(true),
                moment().subtract(1, 'month').endOf('month').utc(true)
            ]
        };
    }

    render() {
        let timeRangeStr = `${this.props.startDate.utc(true).format()} - ${this.props.endDate.utc(true).format()}`;
        return (

            <div style={{display: 'inline-block'}}>
                <label style={{display: 'block'}}>
                    Select an event time range
                </label>
                <span className="glyphicon glyphicon-calendar" style={{marginRight: '10px'}}/>
                <DateRangePicker
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onApply={this.props.onApply}
                    ranges={this.ranges}
                    alwaysShowCalendars={true}
                    timePicker={true}
                    timePicker24Hour={true}
                    timePickerIncrement={15}
                >
                        <input
                            readOnly={true}
                            className={"form-control search-bar__time-input"}
                            value={timeRangeStr}
                        />
                </DateRangePicker>
            </div>
        );
    }
}

export default RangePicker;
