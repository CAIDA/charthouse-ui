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

import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'Hijacks/css/hijacks.css';
import {withRouter} from 'react-router-dom';
import {createBrowserHistory} from "history";
import queryString from 'query-string'
import React from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import SearchBar from "./search-bar";
import {
    extract_largest_prefix,
    translate_suspicion_str_to_values,
    translate_suspicion_values_to_str
} from "../utils/events";
import AsNumber from "./asn";
import IPPrefix from "./ip-prefix";
import {InferenceTagsList} from "./tags/inference-tag";

function unix_time_to_str(unix_time) {
    if (unix_time === null) {
        return "";
    }
    return moment(unix_time * 1000).utc().format("YYYY-MM-DD HH:mm");
}

function renderOrigins(origins, data){
    origins = [...new Set(origins)];    // deduplicate origins
    return (
        <div>
            {
                origins.slice(0,2).map(function(asn){
                    return <AsNumber key={asn} asn={asn} data={data}/>
                })
            }

            {origins.length>2 &&
                "..."
            }
        </div>
    )
}

const columns = [
    {
        name: 'Potential Victims',
        selector: 'victims',
        grow: 1,
        cell: row => {
            return (
                <div>
                    {renderOrigins(row.summary.victims, row.external)}
                </div>
            );
        },
    },
    {
        name: 'Potential Attackers',
        selector: 'attackers',
        grow: 2,
        cell: row => {
            return (
                <div>
                    {renderOrigins(row.summary.attackers, row.external)}
                </div>
            );
        },
    },
    {
        name: 'Largest (Sub)Prefix',
        selector: 'prefixes',
        width: "160px",
        cell: row => {
            let prefix = extract_largest_prefix(row);
            return <IPPrefix prefix={prefix}/>
        }
    },
    {
        name: '# Prefix Events',
        selector: 'prefixes',
        width: "100px",
        cell: row => {
            return row.pfx_events.length
        },
    },
    {
        name: 'Start Time',
        selector: 'view_ts',
        width: "160px",
        cell: row => `${unix_time_to_str(row.view_ts)}`
    },
    {
        name: 'Duration',
        selector: 'finished_ts',
        width: '100px',
        center:true,
        cell: row => {
            let data = row.finished_ts;
            if (data === null) {
                return "ongoing";
            } else {
                let duration = (row.finished_ts - row.view_ts) / 60;
                if (duration < 0) {
                    duration = 0;
                }
                if(duration>1440){
                    // longer than one day
                    return `${Math.round(duration/1440)} day`;
                } else if (duration>60) {
                    // longer than one hour
                    return `${Math.round(duration/60)} hour`;
                } else {
                    return `${duration} min`;
                }
            }
        }
    },
    {
        name: 'Suspicion',
        width: "100px",
        cell: row => {
            let susp_level = row.summary.inference_result.primary_inference.suspicion_level;
            if(susp_level >=80){
                return "High"
            } else if(susp_level>20){
                return "Medium"
            } else {
                return "Low"
            }

        }
    },
    {
        name: 'Category',
        width: "220px",
        cell: row => {
            // return row.summary.inference_result.inferences.map( ({inference_id}) => inference_id);
            return <InferenceTagsList inferences={[row.summary.inference_result.primary_inference]}
                                      render_explanation={false} render_level={false}
            />
        }
    },
    {
        name: 'Type',
        selector: 'event_type',
        width: "120px",
    },
];

class EventsTable extends React.Component {


    constructor(props) {
        super(props);

        this.history = createBrowserHistory();

        this.state = {
            data: [],
            events: [],
            blacklist:[],
            asndrop:[],
            loadingExternal: true,
            totalRows: 0,
            loadingEvents: true,
        };

        this.query = {
            perPage: 10,
            curPage: 0,
            startTime: moment().utc().subtract(1, "days"),
            endTime: moment().utc(),
            eventType: "moas",
            suspicionLevel: "suspicious",
            min_susp: 80,
            max_susp: 100,
            min_duration:0,
            max_duration:0,
            pfxs: [],
            asns: [],
            tags: [],
            codes: [],
        };

        this._parseQueryString();

    }

    componentDidMount() {
        this._loadBlackList();
        this._loadEventsData();
    }

    _loadBlackList = async () => {
        const blacklist = await axios.get("https://bgp.caida.org/json/blacklist");
        const asndrop = await axios.get("https://bgp.caida.org/json/asndrop");
        this.setState({
            blacklist: blacklist.data.blacklist,
            asndrop: asndrop.data.asndrop,
            loadingExternal: false,
        })
    };

    _loadEventsData = async () => {
        let [min_susp, max_susp] = translate_suspicion_str_to_values(this.query.suspicionLevel);

        let baseUrl = `https://bgp.caida.org/json/events?`;

        let params = new URLSearchParams();
        params.append("length", this.query.perPage);
        params.append("start", this.query.perPage * this.query.curPage);
        params.append("ts_start", this.query.startTime.format("YYYY-MM-DDTHH:mm"));
        params.append("ts_end", this.query.endTime.format("YYYY-MM-DDTHH:mm"));
        params.append("min_susp", min_susp);
        params.append("max_susp", max_susp);
        params.append("event_type", this.query.eventType);

        if(this.query.pfxs.length>0){
            params.append("pfxs", this.query.pfxs);
        }
        if(this.query.asns.length>0){
            params.append("asns", this.query.asns);
        }
        if(this.query.tags.length>0){
            params.append("tags", this.query.tags);
        }
        if(this.query.codes.length>0){
            params.append("codes", this.query.codes);
        }
        if(this.query.min_duration>0){
            params.append("min_duration", this.query.min_duration);
        }
        if(this.query.max_duration>0){
            params.append("max_duration", this.query.max_duration);
        }

        let url = baseUrl + params.toString();
        this.history.push(this.history.location.pathname + `?${params.toString()}`);

        const response = await axios.get(url);
        let events = response.data.data;

        this.setState({
            events: events,
            loadingEvents: false,
            totalRows: response.data.recordsTotal,
        });
    };

    /*
     *************************
     * TABLE EVENTS HANDLERS
     *************************
     */

    _handleTablePageChange = (page) => {
        this.query.curPage = page - 1;
        this._loadEventsData();
    };

    _handleTableRowsChange = (perPage, page) => {
        this.query.perPage = perPage;
        this.query.curPage = page - 1;
        this._loadEventsData();
    };

    _handleTableRowClick = (row) => {
        // redirect to sub pages
        window.open(`/feeds/hijacks/events/${row.event_type}/${row.id}`, "_self");
    };

    /*
     ******************************
     * SEARCH-BAR EVENTS HANDLERS
     ******************************
     */

    _handleSearchTimeChange = (event, picker) => {
        this.query.curPage = 0;
        this.query.startTime = picker.startDate.utc();
        this.query.endTime =  picker.endDate.utc();
        this._loadEventsData();
    };

    _handleSearchEventTypeChange = (eventType) => {
        this.query.curPage = 0;
        this.query.eventType =  eventType;
        this._loadEventsData();
    };

    _handleSearchSuspicionChange = (suspicionLevel) => {
        this.query.curPage = 0;
        this.query.suspicionLevel =  suspicionLevel;
        this._loadEventsData();
    };

    _handleSearchSearch = (parameters) => {
        this.query.curPage = 0;
        this.query.pfxs =  parameters.pfxs;
        this.query.asns =  parameters.asns;
        this.query.tags =  parameters.tags;
        this.query.codes =  parameters.codes;
        this._loadEventsData();
    };

    _parseQueryString = () => {
        const parsed = queryString.parse(location.search);
        if("pfxs" in parsed){
            this.query.pfxs = parsed.pfxs.split(",");
        }
        if("tags" in parsed){
            this.query.tags = parsed.tags.split(",");
        }
        if("codes" in parsed){
            this.query.codes = parsed.codes.split(",");
        }
        if("asns" in parsed){
            this.query.asns = parsed.asns.split(",");
        }
        if("length" in parsed){
            this.query.perPage = parseInt(parsed.length);
        }
        if("start" in parsed){
            this.query.curPage = parseInt(parsed.start)/this.query.perPage;
        }
        if("event_type" in parsed){
            this.query.eventType = parsed.event_type;
        }
        if("min_susp" in parsed){
            this.query.min_susp = parseInt(parsed.min_susp);
        }
        if("max_susp" in parsed){
            this.query.max_susp = parseInt(parsed.max_susp);
        }
        if("min_duration" in parsed){
            this.query.min_duration = parseInt(parsed.min_duration);
        }
        if("max_duration" in parsed){
            this.query.max_duration = parseInt(parsed.max_duration);
        }
        if("ts_start" in parsed){
            this.query.startTime = this.parse_time(parsed.ts_start);
        }
        if("ts_end" in parsed){
            this.query.endTime = this.parse_time(parsed.ts_end);
        }

        this.query.suspicionLevel = translate_suspicion_values_to_str(this.query.min_susp, this.query.max_susp);
        [this.query.min_susp, this.query.max_susp] = translate_suspicion_str_to_values(this.query.suspicionLevel);
    };

    parse_time(ts_str){
        if(isNaN(ts_str)){
            // not a number
            return moment.utc(ts_str, "YYYY-MM-DDTHH:mm");
        } else {
            // is a number
            let d = new Date(parseInt(ts_str));
            return moment.utc(d.toUTCString())
        }
    }

    render() {
        let data = [];
        let loading = true;
        if(!this.state.loadingEvents && !this.state.loadingExternal){
            data = this.state.events;
            data.forEach(event => {
                event.external["blacklist"] = this.state.blacklist;
                event.external["asndrop"] = this.state.asndrop;
            });
            loading = false;
        }
        return (
            <React.Fragment>
                <SearchBar
                    query={this.query}
                    onTimeChange={this._handleSearchTimeChange}
                    onEventTypeChange={this._handleSearchEventTypeChange}
                    onEventSuspicionChange={this._handleSearchSuspicionChange}
                    onSearch={this._handleSearchSearch}
                />

                <div className={"row"}>
                    <DataTable
                        title="Events List"
                        columns={columns}
                        striped={true}
                        pointerOnHover={true}
                        highlightOnHover={true}
                        data={data}
                        progressPending={loading}
                        fixedHeader={true}
                        pagination
                        paginationServer
                        paginationDefaultPage={this.query.curPage+1}
                        paginationTotalRows={this.state.totalRows}
                        paginationPerPage={this.query.perPage}
                        paginationRowsPerPageOptions={[10, 30, 50, 100]}
                        onChangeRowsPerPage={this._handleTableRowsChange}
                        onChangePage={this._handleTablePageChange}
                        onRowClicked={this._handleTableRowClick}
                    />
                </div>

            </React.Fragment>
        );
    }
}

export default withRouter(EventsTable);