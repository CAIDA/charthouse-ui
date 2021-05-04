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

import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import axios from "axios";
import SankeyGraph from "../../../../Hijacks/components/sankeyGraph";
import TraceroutesTable from "../../../../Hijacks/components/traceroutes-table";
import PfxEventDetailsTable from "../../../../Hijacks/components/pfx-event-details-table";
import {BASE_URL, TAGS_URL} from "../../../../Hijacks/utils/endpoints";

const HORIZONTAL_OFFSET = 480;

class PfxEventDetails extends React.Component {

    constructor(props) {
        super(props);
        this.eventId = this.props.match.params.eventId;
        this.fingerprint = this.props.match.params.pfxEventId;
        this.eventType = this.eventId.split("-")[0];
        this.state = {
            eventData: {},
            tagsData: {},
            subpaths: [],
            superpaths: [],
            pfxEvent: [],
            tr_aspaths: [],
            tr_results: [],
            loadingEvent: true,
            loadingPfxEvent: true,
        };

    }

    componentDidMount() {
        this.loadEventData();
        this.loadPfxEventData();
        this.loadTagsData();
    }

    async loadTagsData() {
        const response = await axios.get(TAGS_URL);
        this.setState({
            tagsData: response.data,
        });
    }

    loadEventData = async() => {
        const response = await axios.get(`https://api.grip.caida.org/dev/json/event/id/${this.eventId}`);
        this.setState({
            loadingEvent: false,
            eventData: response.data,
        })
    };

    loadPfxEventData = async () => {
        const response = await axios.get(
            `https://api.grip.caida.org/dev/json/pfx_event/id/${this.eventId}/${this.fingerprint}`,
        );
        let subpaths = [];
        let superpaths = [];

        if (["submoas", "defcon"].includes(this.eventType)) {
            // if this is a submoas or defcon events, we should show two sankey graphs
            subpaths = response.data.details.sub_aspaths.split(":").map(path => path.split(" "));
            superpaths = response.data.details.super_aspaths.split(":").map(path => path.split(" "));
        } else {
            subpaths = response.data.details.aspaths.split(":").map(path => path.split(" "));
        }

        let data = response.data;
        let pfxEvent = {
            "details": data.details,
            "tags": data.tags,
            "inferences": data.inferences,
            "traceroutes": data.traceroutes,
            "victims": data.victims,
            "attackers": data.attackers,
            "fingerprint": this.fingerprint,
            "event_type": data.event_type,
            "view_ts": data.view_ts,
            "finished_ts": data.finished_ts,
        };
        console.log(`event_type = ${data.event_type}`);
        if ("prefix" in data.details) {
            pfxEvent.prefix = data.details.prefix;
        }
        if ("sub_pfx" in data.details) {
            pfxEvent.sub_pfx = data.details.sub_pfx;
        }
        if ("super_pfx" in data.details) {
            pfxEvent.super_pfx = data.details.super_pfx;
        }

        let msms = response.data.traceroutes.msms;
        let msms_filtered = []; // store good to use traceroute results
        let targets = new Set(msms.map(msm=>msm["target_asn"]));
        let as_routes = [];
        if (msms.length > 0) {
            msms.forEach(function (traceroute) {
                if ("results" in traceroute && Object.keys(traceroute["results"]).length > 0) {
                    traceroute["results"].forEach(function (result) {
                        let as_traceroute = result["as_traceroute"];
                        if (as_traceroute.length !== 0) {
                            let raw_path = result["as_traceroute"];
                            let tr_path = [];
                            // properly render missing traceroute nodes
                            for(let i = 0; i < raw_path.length; i++){
                                let asn = raw_path[i];
                                if(asn!=="*"){
                                    tr_path.push(asn);
                                } else {
                                    if(i===raw_path.length -1){
                                        // if * appears as the last hop
                                        tr_path.push(`*`.replace(" ","_"));
                                    } else {
                                        tr_path.push(`*_${raw_path[i+1]}`.replace(" ","_"));
                                    }
                                }
                            }
                            // push an extra * if the last hop isn't one of the target ASN
                            let last_hop = tr_path[tr_path.length-1];
                            if(last_hop !== "*" && !targets.has(last_hop)){
                                tr_path.push("*");
                            }
                            if (tr_path.length === 0) {
                                console.log(`error as tr path: '${tr_path}', from ${result["as_traceroute"]}`);
                            } else {
                                as_routes.push(tr_path);
                            }
                        }
                    });
                    msms_filtered.push(traceroute);
                }
            });
        }

        this.setState({
            subpaths: subpaths,
            superpaths: superpaths,
            pfxEvent: pfxEvent,
            tr_aspaths: as_routes,
            tr_results: msms_filtered,
            loadingPfxEvent: false,
        });
    };

    render() {
        let showTrResults = this.state.tr_results.length > 0;

        let sankeyGraphs;
        if(this.state.loadingPfxEvent){
            return null
        }

        let victims = this.state.pfxEvent.victims;
        let attackers = this.state.pfxEvent.attackers;

        if (["submoas", "defcon"].includes(this.eventType)) {
            sankeyGraphs =
                <React.Fragment>
                    <SankeyGraph
                        data={this.state.subpaths}
                        title={"Route Collectors AS Path Sankey Diagram - Sub Prefix"}
                        id={"sub_sankey"}
                        highlights={[]}
                        benign_nodes={victims}
                        suspicious_nodes={attackers}
                    />
                    <SankeyGraph
                        data={this.state.superpaths}
                        title={"Route Collectors AS Path Sankey Diagram - Super Prefix"}
                        id={"super_sankey"}
                        highlights={[]}
                        benign_nodes={victims}
                        suspicious_nodes={attackers}
                    />
                </React.Fragment>

        } else {
            let highlights = [];
            if(this.eventType==="edges"){
                highlights.push(this.eventId.split("-")[2].split("_"))
            }
            // edges and moas
            sankeyGraphs =
                <React.Fragment>
                    <SankeyGraph
                        data={this.state.subpaths}
                        title={"Route Collectors AS Path Sankey Diagram"}
                        highlights={highlights}
                        id={"pfx_sankey"}
                        benign_nodes={victims}
                        suspicious_nodes={attackers}
                    />
                </React.Fragment>
        }

        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1><a href={`/feeds/hijacks/events/${this.state.eventData.event_type}/${this.state.eventData.id}`}> 	&#128281; </a></h1>
                        <h1>Prefix Event Details</h1>
                    </div>
                </div>

                {/*{!this.state.loadingEvent &&*/}
                {/*    <div className="row">*/}
                {/*        <EventDetailsTable data={this.state.eventData} jsonUrl={this.jsonUrl}/>*/}
                {/*    </div>*/}
                {/*}*/}


                {!this.state.loadingPfxEvent && !this.loadingEvent &&
                    // pfx event loading finished

                    <React.Fragment>
                        <div className="row">
                            {/*<PfxEventsTable*/}
                            {/*    data={[this.state.pfxEvent]}*/}
                            {/*    inference={this.state.eventData.inference}*/}
                            {/*    eventType={this.eventType}*/}
                            {/*    eventId={this.eventId}*/}
                            {/*    tagsData={this.state.tagsData}*/}
                            {/*    isEventDetails={false}*/}
                            {/*    enableClick={false} enablePagination={false}*/}
                            {/*/>*/}

                            <PfxEventDetailsTable
                                pfxEvent={this.state.pfxEvent}
                                tagsData={this.state.tagsData}
                                jsonUrl={`${BASE_URL}/pfx_event/id/${this.eventId}/${this.fingerprint}`}
                                asinfo={this.state.eventData.asinfo}
                                eventData={this.state.eventData}
                            />

                            {/*<div className="col-lg-12">*/}
                            {/*    <a target='_blank' type="button" className="btn btn-sm btn-primary"*/}
                            {/*       href={`https://bgp.caida.org/json/pfx_event/id/${this.eventId}/${this.fingerprint}`}>*/}
                            {/*        Raw JSON</a>*/}
                            {/*</div>*/}
                        </div>

                        <div className="row">
                            {sankeyGraphs}
                        </div>

                        { showTrResults &&
                        <div className="row">
                            <React.Fragment>
                                <TraceroutesTable data={this.state.tr_results}/>
                                <SankeyGraph
                                    title={"Traceroutes Sankey"}
                                    data={this.state.tr_aspaths}
                                    highlights={[]}
                                    id={"tr_sankey"}
                                    benign_nodes={this.state.pfxEvent.victims}
                                    suspicious_nodes={this.state.pfxEvent.attackers}
                                />
                            </React.Fragment>
                        </div>
                        }
                    </React.Fragment>
                }
            </div>
        );
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default PfxEventDetails;
