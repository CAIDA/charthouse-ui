import React from "react";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";

class SearchBar extends React.Component {

    constructor(props) {
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
        return (
            <div className={"row search-bar"}>
                <div className={"search-bar__time"}>
                    <DateRangePicker
                        startDate={this.props.startTime}
                        endDate={this.props.endTime}
                        onApply={this.props.onTimeChange}
                        ranges={this.ranges}
                        alwaysShowCalendars={true}
                        timePicker={true}
                        timePicker24Hour={true}
                        timePickerIncrement={15}
                    >
                        <a href="#" className="btn btn-info btn-md search-bar__time-btn">
                            <span className="glyphicon glyphicon-calendar"/> Time Range
                        </a>
                    </DateRangePicker>

                    <input
                        readOnly={true}
                        className={"form-control search-bar__time-input"}
                        value={this.props.timeRangeStr}
                    />
                </div>

                <div>
                    Suspicion Level:
                    <form>
                        <label className="radio-inline"><input onChange={this.props.onSuspicionChange} type="radio"
                                                               name="optradio" value={"suspicious"}
                                                               checked={this.props.suspicionLevel === "suspicious"}/>suspicious</label>
                        <label className="radio-inline"><input onChange={this.props.onSuspicionChange} type="radio"
                                                               name="optradio" value={"grey"}
                                                               checked={this.props.suspicionLevel === "grey"}/>grey</label>
                        <label className="radio-inline"><input onChange={this.props.onSuspicionChange} type="radio"
                                                               name="optradio" value={"benign"}
                                                               checked={this.props.suspicionLevel === "benign"}/>benign</label>
                        <label className="radio-inline"><input onChange={this.props.onSuspicionChange} type="radio"
                                                               name="optradio" value={"all"}
                                                               checked={this.props.suspicionLevel === "all"}/>all</label>
                    </form>
                </div>
            </div>
        );
    }
}

export default SearchBar;
