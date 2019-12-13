import React from "react";
import {extract_impact, extract_largest_prefix, unix_time_to_str} from "../utils/events";
import AsNumber from "./asn";

class EventDetailsTable extends React.Component {

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

        processed["suspicion"] = data.inference.suspicion.suspicion_level;
        processed["misconf"] = data.inference.misconfiguration.toString();
        processed["comments"] = data.inference.comments.map((value, index) => {
            return <p key={`comment-${index}`}>{value}</p>
        });

        return processed;
    }

    render() {

        let data = this.preprocessData(this.props.data);

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-lg-6">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <th>Potential Victim:</th>
                                    <td>
                                        {
                                            data.victims.map(function(asn){
                                                return <AsNumber key={asn} asn={asn} data={data.external.asrank[parseInt(asn)]} />
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Potential Attacker:</th>
                                    <td>
                                        {
                                            data.attackers.map(function(asn){
                                                return <AsNumber key={asn} asn={asn} data={data.external.asrank[parseInt(asn)]} />
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Event type:</th>
                                    <td>{data.event_details_type}</td>
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
                    <div className="col-lg-6">
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
                                    <th>Suspicion Level:</th>
                                    <td>{data.suspicion}</td>
                                </tr>
                                <tr>
                                    <th>Misconfiguration</th>
                                    <td>{data.misconf}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {data.comments.length>0 &&
                    <div className="col-lg-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <th>Comments:</th>
                                    <td>
                                        {data.comments}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    }
                </div>

                <div className={"row"}>
                    <div className="col-lg-12">
                        <a target='_blank' type="button" className="btn btn-sm btn-primary" href={this.props.jsonUrl}>
                            Raw JSON</a>
                    </div>
                </div>
            </React.Fragment>

    );
    }
}

export default EventDetailsTable;
