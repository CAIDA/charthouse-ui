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
import {unix_time_to_str} from "../utils/events";
import AsNumber from "./asn";
import IPPrefix from "./ip-prefix";
import axios from "axios";
import {InferenceTagsList} from "./tags/inference-tag";
import {PropertyTagsList} from "./tags/property-tag";
import {extract_tags_tr_worthiness} from "../utils/tags";
import {ASNDROP_URL, BLOCKLIST_URL} from "../utils/endpoints";

/**
 * Prefix event details table.
 *
 * The table contains the following information:
 * - potential victim(s)
 * - potential attacker(s)
 * - start time
 * - end time
 * - duration
 * - event-type
 * - prefixes (single for moas and edges, two for submoas and defcon)
 * - tags
 * - inferences
 */
class PfxEventDetailsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "blacklist": [],
            "asndrop": [],
            "ready": false,
        }
    }

    /**
     * Preprocess incoming prefix event data.
     *
     * The available data includes:
     * - attackers
     * - victims
     * - event_type
     * - view_ts
     * - finished_ts
     * - inferences
     * - position
     * - tags
     * - traceroutes
     * - details (evnet type specific)
     *
     * @param data event data
     * @returns {*}
     */
    preprocessData(data) {
        let processed = data;
        let tags_tr_worthy_dict = extract_tags_tr_worthiness(this.props.tagsData);
        let tags_dict={};

        let event_type_explain = {
            "moas": "origin hijack (moas)",
            'submoas': "origin hijack (submoas)",
            "edges": "path manipulation",
            "defcon": "defcon-16"
        };
        processed["type"] = event_type_explain[data.event_type];

        processed["start_ts_str"] = unix_time_to_str(data["view_ts"]);
        processed["end_ts_str"] = "Unknown";
        processed["duration"] = "Ongoing";
        if (data["finished_ts"] !== null) {
            processed["end_ts_str"] = unix_time_to_str(data["finished_ts"]);
            processed["duration"] = `${(data["finished_ts"] - data["view_ts"]) / 60} min`;
        }

        processed["inferences"] = data.inferences;
        processed["tags"] = data.tags;
        processed.tags.forEach((tag)=>{
            tags_dict[tag.name] = tag.name in tags_tr_worthy_dict? tags_tr_worthy_dict[tag.name]: "unknown";
        });
        processed.tags_dict=tags_dict;

        return processed
    }

    componentDidMount() {
        this._loadBlackList();
    }

    _loadBlackList = async () => {
        const blacklist = await axios.get(BLOCKLIST_URL);
        const asndrop = await axios.get(ASNDROP_URL);
        this.setState({
            blacklist: blacklist.data.blocklist,
            asndrop: asndrop.data.asndrop,
        })
    };

    render() {

        if(this.props.eventData === null || this.props.pfxEvent===null){
            return ""
        }
        let data = this.preprocessData(this.props.pfxEvent);
        let asinfo = this.props.asinfo;
        if(asinfo===undefined){
            asinfo = {};
        }
        if(this.state.blacklist.length>0){
            asinfo.blacklist = this.state.blacklist;
            asinfo.asndrop = this.state.asndrop;
        }

        let victims = "None";
        let attackers = "None";
        if(data.victims.length>0){
            victims = data.victims.map(function(asn){ return <AsNumber key={asn} asn={asn} data={asinfo} /> });
        }
        if(data.attackers.length>0){
            attackers = data.attackers.map(function(asn){ return <AsNumber key={asn} asn={asn} data={asinfo} /> });
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
                                        { victims }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Potential Attacker:</th>
                                    <td>
                                        { attackers }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Event type:</th>
                                    <td>{data.type}</td>
                                </tr>
                                <tr>
                                    <th>Prefixes:</th>
                                    <td>
                                        {(
                                            this.props.pfxEvent.event_type==="submoas" ||
                                            this.props.pfxEvent.event_type==="defcon"
                                        ) &&
                                            <div>
                                                <IPPrefix prefix={data.details.super_pfx}/>
                                                <IPPrefix prefix={data.details.sub_pfx}/>
                                            </div>
                                        }
                                        {(
                                            this.props.pfxEvent.event_type==="moas" ||
                                            this.props.pfxEvent.event_type==="edges"
                                        ) &&
                                            <div>
                                                <IPPrefix prefix={data.details.prefix}/>
                                            </div>
                                        }
                                    </td>
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <th>Tags:</th>
                                    <td>
                                        <PropertyTagsList tags={data.tags_dict}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Inferences:</th>
                                    <td>
                                        <InferenceTagsList inferences={data.inferences}/>
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

export default PfxEventDetailsTable;
