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
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import {PropertyTagsList} from "./tags/property-tag";
import {extract_tags_tr_worthiness} from "../utils/tags";
import IPPrefix from "./ip-prefix";
import LinkA from "../../Hi3/components/linka";
import {InferenceTagsList} from "./tags/inference-tag";


class PfxEventsTable extends React.Component {

    columns1 = [];
    columns2 = [];


    static propTypes = {
        isEventDetails: PropTypes.bool,
        enableClick: PropTypes.bool,
        enablePagination: PropTypes.bool,
    };

    static defaultProps = {
        enableClick: true,
        enablePagination: true,
    };

    constructor(props){
        super(props);
        this.constructColumns()
    }

    tr_available = (msms) => {
        return !!msms.every((msm) => {
            return "msm_id" in msm && msm["msm_id"] > 0
        });
    };

    constructColumns = () => {

        this.columns1 = [
            {
                name: 'Prefix',
                selector: 'prefix',
                grow:1,
                cell: row=>{
                    let origins = [];
                    if("origins" in row.details){
                        origins = row.details.origins;
                    } else if ("as1" in row.details){
                        origins = [row.details.as1, row.details.as2]
                    }
                    let ases = origins.map(asn=>{
                        return <a key={asn} href={`https://asrank.caida.org/asns?asn=${asn}`} target="_blank"> AS{asn} </a>
                    }).reduce((prev, curr) => [prev, ', ', curr]);

                    return <div>
                        <IPPrefix prefix={row.prefix}/> ({ases})
                    </div>
                }
            },
            {
                name: 'Tags',
                selector: 'tags',
                wrap: true,
                grow:2,
                cell: row => {

                    console.log(row);
                    let url = `/feeds/hijacks/events/${this.props.eventType}/${this.props.eventId}/${row.fingerprint}`;
                    return <PropertyTagsList tags={row.tags_dict} enableClick={this.props.enableClick} url={url}/>
                }
            },
            {
                name: 'Inferences',
                selector: 'inferences',
            },
            {
                name: 'Traceroute Worthy',
                selector: 'tr_worthy',
                width: "150px",
            },
            {
                name: 'Traceroute Available',
                selector: 'tr_available',
                width: "150px",
            },
            {
                name: '',
                selector: 'tr_worthy',
                width: "100px",
                cell: row=>{
                    if(this.props.isEventDetails) {
                        let url = `/feeds/hijacks/events/${this.props.eventType}/${this.props.eventId}/${row.fingerprint}`;
                        return <LinkA type="button" className="btn btn-sm btn-primary" to={url}>
                            Details
                        </LinkA>
                    }
                    return ""
                }
            },
        ];

        this.columns2 = [
            {
                name: 'Sub Prefix',
                selector: 'sub_pfx',
                grow:1,
                cell: row =>{
                    let origins = [];
                    if('sub_origins' in row.details){
                        origins = row.details.sub_origins;
                    } else if ('old_origins' in row.details){
                        origins = row.details.old_origins;
                        if(this.props.eventType==="defcon"){
                            origins = origins.concat(row.details.new_origins);
                        }
                    }

                    let ases = origins.map(asn=>{
                        return <a key={`pfx-asn-${asn}`} href={`https://asrank.caida.org/asns?asn=${asn}`} target="_blank"> AS{asn} </a>
                    }).reduce((prev, curr) => [prev, ', ', curr]);

                    return <React.Fragment>
                        <IPPrefix prefix={row.sub_pfx}/> ({ases})
                    </React.Fragment>
                }
            },
            {
                name: 'Super Prefix',
                selector: 'super_pfx',
                grow:1,
                cell: row=>{
                    let origins = [];
                    if('super_origins' in row.details){
                        origins = row.details.super_origins;
                    } else if ('old_origins' in row.details){
                        origins = row.details.old_origins
                        if(this.props.eventType==="defcon"){
                            origins = origins.concat(row.details.new_origins);
                        }
                    }

                    let ases = origins.map(asn=>{
                        return <a href={`https://asrank.caida.org/asns?asn=${asn}`} target="_blank"> AS{asn} </a>
                    }).reduce((prev, curr) => [prev, ', ', curr]);

                    return <React.Fragment>
                        <IPPrefix prefix={row.super_pfx}/> ({ases})
                    </React.Fragment>
                }
            },
            {
                name: 'Tags',
                selector: 'tags',
                wrap: true,
                grow:2,
                cell: row => {
                    let url = `/feeds/hijacks/events/${this.props.eventType}/${this.props.eventId}/${row.fingerprint}`;
                    return <PropertyTagsList tags={row.tags_dict} enableClick={this.props.enableClick} url={url}/>
                }
            },
            {
                name: 'Inferences',
                selector: 'inferences',
                // width: "150px",
            },
            {
                name: 'Traceroute Worthy',
                selector: 'tr_worthy',
                width: "150px",
            },
            {
                name: 'Traceroute Available',
                selector: 'tr_available',
                width: "150px",
            },
            {
                name: '',
                selector: 'tr_worthy',
                width: "100px",
                cell: row=>{
                    if(this.props.isEventDetails) {
                        let url = `/feeds/hijacks/events/${this.props.eventType}/${this.props.eventId}/${row.fingerprint}`;
                        return <LinkA type="button" className="btn btn-sm btn-primary" to={url}>
                            Details
                        </LinkA>
                    }
                    return ""
                }
            },
        ];
    };

    preprocessData(pfx_events, tags_data) {

        let processed = [];

        let tags_tr_worthy_dict = extract_tags_tr_worthiness(tags_data);


        for (let pfx_event of pfx_events) {
            let event = {};
            let tags_dict={};

            let prefixes = [];
            if ("prefix" in pfx_event) {
                event.prefix = pfx_event.prefix;
                prefixes.push(pfx_event.prefix);
            }
            if ("sub_pfx" in pfx_event) {
                event.sub_pfx = pfx_event.sub_pfx;
                prefixes.push(pfx_event.sub_pfx);
            }
            if ("super_pfx" in pfx_event) {
                event.super_pfx = pfx_event.super_pfx;
                prefixes.push(pfx_event.super_pfx);
            }
            event.tags = pfx_event.tags;
            event.tr_worthy = pfx_event.traceroutes.worthy.toString();
            event.tr_available = pfx_event.traceroutes.msms.some(msm => msm.results.length>0).toString();
            event.inferences = <InferenceTagsList inferences={pfx_event.inferences}/>;
            event.fingerprint = prefixes.join("_")
                .replace(/\//g, "-");
            pfx_event.tags.forEach((tag)=>{
                tags_dict[tag.name] = tag.name in tags_tr_worthy_dict? tags_tr_worthy_dict[tag.name]: "unknown";
            });
            event.tags_dict=tags_dict;
            event.details=pfx_event.details;
            processed.push(event);
        }
        return processed;
    }

    render() {
        let data = this.preprocessData(this.props.data, this.props.tagsData);
        let columns = [];
        if (["moas", "edges"].includes(this.props.eventType)) {
            columns = this.columns1
        } else {
            columns = this.columns2
        }

        return (
            <DataTable
                title={this.props.title}
                columns={columns}
                striped={true}
                highlightOnHover={true}
                data={data}
                pagination={this.props.enablePagination}
            />
        );
    }
}

export default PfxEventsTable;
