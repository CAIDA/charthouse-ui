import React from "react";
import {extract_impact, extract_largest_prefix, unix_time_to_str} from "../utils/events";
import AsNumber from "./asn";
import IPPrefix from "./ip-prefix";
import axios from "axios";

class EventDetailsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "blacklist": [],
            "asndrop": [],
            "eventData": this.preprocessData(this.props.data),
            "ready": false,
        }
    }

    /**
     * Preprocess incoming event data
     * @param data event data
     * @returns {*}
     */
    preprocessData(data) {
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

        let primary_inference = data.summary.inference_result.primary_inference;
        processed["inference"] = `${primary_inference.inference_id} (${primary_inference.suspicion_level})`;
        processed["explanation"] = primary_inference.explanation;

        return processed
    }

    componentDidMount() {
        this._loadBlackList();
    }

    _loadBlackList = async () => {
        const blacklist = await axios.get("https://bgp.caida.org/json/blacklist");
        const asndrop = await axios.get("https://bgp.caida.org/json/asndrop");
        this.setState({
            blacklist: blacklist.data.blacklist,
            asndrop: asndrop.data.asndrop,
        })
    };

    render() {

        if(this.state.eventData === null){
            return ""
        }


        let data = this.state.eventData;
        if(this.state.blacklist.length>0){
            data.external.blacklist = this.state.blacklist;
            data.external.asndrop = this.state.asndrop;
        }

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
                                            data.summary.inference_result.victims.map(function(asn){
                                                return <AsNumber key={asn} asn={asn} data={data.external} />
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Potential Attacker:</th>
                                    <td>
                                        {
                                            data.summary.inference_result.attackers.map(function(asn){
                                                return <AsNumber key={asn} asn={asn} data={data.external} />
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
                                    <td> <IPPrefix prefix={data.largest_prefix}/> </td>
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
                                    <th>Primary Inference (suspicion level):</th>
                                    <td>{data.inference}</td>
                                </tr>
                                <tr>
                                    <th>Explanation:</th>
                                    <td>{data.explanation}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
