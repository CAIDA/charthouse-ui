/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

import React from "react";
import {extract_impact, extract_largest_prefix, unix_time_to_str} from "../utils/events";
import AsNumber from "./asn";
import IPPrefix from "./ip-prefix";
import axios from "axios";
import {InferenceTagsList} from "./tags/inference-tag";
import {ASNDROP_URL, BLOCKLIST_URL} from "../utils/endpoints";

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

        processed["inferences"] = data.summary.inference_result.inferences;
        processed["primary_inference"] = data.summary.inference_result.primary_inference;

        return processed
    }

    componentDidMount() {
        this._loadBlackList();
    }

    _loadBlackList = async () => {
        const blocklist = await axios.get(BLOCKLIST_URL);
        const asndrop = await axios.get(ASNDROP_URL);
        this.setState({
            blacklist: blocklist.data.blocklist,
            asndrop: asndrop.data.asndrop,
        })
    };

    render() {

        if(this.state.eventData === null){
            return ""
        }

        let data = this.state.eventData;
        if(data.asinfo===undefined){
            data.asinfo={};
        }
        if(this.state.blacklist.length>0){
            data.asinfo.blacklist = this.state.blacklist;
            data.asinfo.asndrop = this.state.asndrop;
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
                                        {data.summary && data.summary.victims &&
                                            data.summary.victims.map(function(asn){
                                                return <AsNumber key={asn} asn={asn} data={data.asinfo} />
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Potential Attacker:</th>
                                    <td>
                                        {data.summary && data.summary.attackers &&
                                            data.summary.attackers.map(function(asn){
                                                return <AsNumber key={asn} asn={asn} data={data.asinfo} />
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Event type:</th>
                                    <td>{data.event_details_type}</td>
                                </tr>
                                <tr>
                                    <th>Largest (sub)prefix:</th>
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
                                {/*<tr>*/}
                                {/*    <th>All Inferences:</th>*/}
                                {/*    <td>*/}
                                {/*        <InferenceTagsList inferences={data.inferences}/>*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                <tr>
                                    <th>Primary Inference (suspicion level):</th>
                                    <td>
                                        <InferenceTagsList inferences={[data.primary_inference]} render_explanation={true}/>
                                    </td>
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
