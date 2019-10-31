import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {extract_impact, extract_largest_prefix, unix_time_to_str} from "../utils/events";

class EventDetailsTable extends React.Component {
    static propTypes = {
        eventId: PropTypes.string,
    };
    static defaultProps = {
        eventId: "",
    };

    state = {
        data: {},
        loading: false,
        success: false,
        error_msg: "",
    };

    /**
     * Preprocess incoming event data
     * @param data event data
     * @returns {*}
     */
    preprocessData(data) {

        function hashCode(str) {
            return str.split('').reduce((prevHash, currVal) =>
                (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
        }

        let event_type_explain = {
            'moas': "origin hijack (moas)",
            'submoas': "origin hijack (submoas)",
            'edges': "path manipulation",
            'defcon': "defcon-16"
        };

        let processed = data;
        processed["largest_prefix"] = extract_largest_prefix(data);
        processed["impact"] = extract_impact(data);

        processed["start_ts_str"] = unix_time_to_str(data["view_ts"]);
        processed["event_details_type"] = event_type_explain[data.event_type];
        processed["end_ts_str"] = "Unknown";
        processed["duration"] = "Ongoing";
        if (data["finished_ts"] !== null) {
            processed["end_ts_str"] = unix_time_to_str(data["finished_ts"]);
            processed["duration"] = `${(data["finished_ts"] - data["view_ts"]) / 60} min`;
        }
        let comment_html = [];
        data["inference"]["comments"].forEach(function (comment) {
            comment_html.push(<p key={hashCode(comment)}> {comment} </p>)
        });
        processed["event_comments"] = comment_html;


        return processed;
    }

    async componentDidMount() {
        this.setState({loading: true});

        const response = await axios.get(
            `https://bgp.caida.org/json/event/id/${this.props.eventId}`,
        );

        if ("error" in response.data) {
            this.setState({
                loading: false,
                success: false,
                error_msg: response.data.error
            });
            return;
        }

        this.setState({
            data: this.preprocessData(response.data),
            loading: false,
            success: true,
        });
    }

    render() {
        const {loading, data, success, error_msg} = this.state;
        if (loading) {
            return (<div>loading data ...</div>)
        }
        if (!success) {
            return (
                <div>
                    <p>
                        Event details loading failed
                    </p>
                    <p>
                        {error_msg}
                    </p>
                </div>
            )
        }
        return (
            <div>
                <div className="col-xs-6">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                <th>Potential Victim:</th>
                                <td>{data.victims}</td>
                            </tr>
                            <tr>
                                <th>Potential Attacker:</th>
                                <td>{data.attackers}</td>
                            </tr>
                            <tr>
                                <th>Largest prefix:</th>
                                <td>{data.largest_prefix}</td>
                            </tr>
                            <tr>
                                <th>Impact:</th>
                                <td>{data.impact}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                <th>Start time:</th>
                                <td>{data.start_ts_str}</td>
                            </tr>
                            <tr>
                                <th>End time:</th>
                                <td>{data.end_ts_str}</td>
                            </tr>
                            <tr>
                                <th>Duration:</th>
                                <td>{data.duration}</td>
                            </tr>
                            <tr>
                                <th>Event type:</th>
                                <td>{data.event_details_type}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                <th>Comments:</th>
                                <td>{data.event_comments}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        );
    }
}

export default EventDetailsTable;
