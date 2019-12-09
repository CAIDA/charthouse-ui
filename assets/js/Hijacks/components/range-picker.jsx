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
                moment().utc()
            ],
            'Yesterday': [
                moment().utc().subtract(2, 'days').startOf('day'),
                moment().utc().subtract(1, 'days').startOf('day')
            ],
            'Last 7 Days': [
                moment().utc().subtract(6, 'days').startOf('day'),
                moment().utc()
            ],
            'Last 30 Days': [
                moment().utc().subtract(29, 'days').startOf('day'),
                moment().utc()
            ],
            'This Month': [
                moment().utc().startOf('month'),
                moment().utc().endOf('month')
            ],
            'Last Month': [
                moment().utc().subtract(1, 'month').startOf('month'),
                moment().utc().subtract(1, 'month').endOf('month')
            ]
        };
    }

    render() {
        let timeRangeStr = `${this.props.startDate.utc().format("lll")} - ${this.props.endDate.utc().format("lll")}`;
        return (
            <div className="search-bar__component">
                <label className="search-bar__label">
                    Select an event time range (now: {moment().utc().format("lll")})
                </label>
                <span className="glyphicon glyphicon-calendar search-bar__time-icon"/>
                <DateRangePicker
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onApply={this.props.onApply}
                    ranges={this.ranges}
                    alwaysShowCalendars={true}
                    timePicker={true}
                    timePicker24Hour={true}
                    timePickerIncrement={5}
                >
                        <input
                            readOnly={true}
                            className="form-control search-bar__time-input"
                            value={timeRangeStr}
                        />
                </DateRangePicker>
            </div>
        );
    }
}

export default RangePicker;
