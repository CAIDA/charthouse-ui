import React from "react";
import EventTypeSelector from "./event-type-selector";
import EventSuspicionSelector from "./event-suspicion-selector";
import RangePicker from "./range-picker";
import EventSearchBox from "./event-search-box";
import EventShortcutSelector from "./event-shortcut-selector";

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row search-bar">
                <EventTypeSelector eventType={this.props.query.eventType}
                                   onChange={this.props.onEventTypeChange}
                />

                <EventShortcutSelector
                                   eventCategories={this.props.query.codes}
                                   onChange={this.props.onEventCategoryChange}
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
                    codes={this.props.query.codes}
                    onSearch={this.props.onSearch}
                />

            </div>
        );
    }
}

export default SearchBar;
