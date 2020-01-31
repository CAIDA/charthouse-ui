import React from 'react';
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";

class RangePicker extends React.Component {

    constructor(props){
        super(props);
        this.ranges = {
            'Today': [
                moment().startOf('day').utc(true),
                moment.utc()
            ],
            '-4 hours': [
                moment.utc().subtract(4, 'hours'),
                moment.utc()
            ],
            '-24 hours': [
                moment.utc().subtract(1, 'days'),
                moment.utc()
            ],
            '-7 days': [
                moment.utc().subtract(7, 'days'),
                moment.utc()
            ],
            '-1 month': [
                moment.utc().subtract(1, 'months'),
                moment.utc()
            ],
            '-1 year': [
                moment.utc().subtract(1, 'years'),
                moment.utc()
            ]
        };
    }

    render() {
        let timeRangeStr = `${this.props.startDate.utc().format("lll")} - ${this.props.endDate.utc().format("lll")}`;
        return (
            <div className="search-bar__component">
                <label className="search-bar__label">
                    Select time period (UTC now: {moment().utc().format("lll")})
                </label>
                <span className="glyphicon glyphicon-calendar search-bar__time-icon"/>
                <DateRangePicker
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onApply={this.props.onApply}
                    ranges={this.ranges}
                    showDropdowns={true}
                    minYear={2000}
                    alwaysShowCalendars={true}
                    autoApply={true}
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
