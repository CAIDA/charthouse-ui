import React from "react";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import EventTypeSelector from "./event-type-selector";
import EventSuspicionSelector from "./event-suspicion-selector";
import RangePicker from "./range-picker";
import EventSearchBox from "./event-search-box";

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"row search-bar"}>
                <EventTypeSelector eventType={this.props.query.eventType}
                                   onChange={this.props.onEventTypeChange}
                />

                <EventSuspicionSelector eventSuspicionLevel={this.props.query.suspicionLevel}
                                   onChange={this.props.onEventSuspicionChange}
                />

                <RangePicker
                    startDate={this.props.query.startTime}
                    endDate={this.props.query.endTime}
                    onApply={this.props.onTimeChange}
                />

                <EventSearchBox
                    pfxs={this.props.query.pfxs}
                    asns={this.props.query.asns}
                    tags={this.props.query.tags}
                    onSearch={this.props.onSearch}
                />

            </div>
        );
    }
}

export default SearchBar;
