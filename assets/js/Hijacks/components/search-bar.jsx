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
                <EventTypeSelector eventType={this.props.eventType}
                                   onChange={this.props.onEventTypeChange}
                />

                <EventSuspicionSelector eventType={this.props.suspicionLevel}
                                   onChange={this.props.onEventSuspicionChange}
                />

                <RangePicker
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onApply={this.props.onTimeChange}
                />

                <EventSearchBox onSearch={this.props.onSearch}/>

            </div>
        );
    }
}

export default SearchBar;
