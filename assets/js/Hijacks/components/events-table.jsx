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
import {translate_suspicion_str_to_values, translate_suspicion_values_to_str} from "../utils/events";
import AsNumber from "./asn";
import IPPrefix from "./ip-prefix";

function unix_time_to_str(unix_time) {
    if (unix_time === null) {
        return "";
    }
    return moment(unix_time * 1000).utc().format("YYYY-MM-DD HH:mm");
}

function renderOrigins(origins, data){
    return (
        <div>
            {
                origins.slice(0,2).map(function(asn){
                    return <AsNumber key={asn} asn={asn} data={data.asrank[parseInt(asn)]} />
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
                    {renderOrigins(row.victims, row.external)}
                </div>
            );
        },
    },
    {
        name: 'Potential Attackers',
        selector: 'attackers',
        grow: 1,
        cell: row => {
            return (
                <div>
                    {renderOrigins(row.attackers, row.external)}
                </div>
            );
        },
    },
    {
        name: 'Largest Prefix',
        selector: 'prefixes',
        width: "160px",
        cell: row => {
            let data = row.prefixes;
            let maxsize = 32;
            let maxpfx = data[0];
            for (let pfx in data.slice(1)) {
                let size = parseInt(pfx.split("/")[1]);
                if (size < maxsize) {
                    maxsize = size;
                    maxpfx = pfx
                }

            }
            return <IPPrefix prefix={maxpfx}/>
        }
    },
    {
        name: '# Prefix Events',
        selector: 'prefixes',
        width: "100px",
        cell: row => {
            let data = row.prefixes;
            return data.length
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
        minWidth: '80px',
        maxWidth: '120px',
        cell: row => {
            let data = row.finished_ts;
            if (data === null) {
                return "ongoing";
            } else {
                let duration = (row.finished_ts - row.view_ts) / 60;
                if (duration < 0) {
                    duration = 0;
                }
                return `${duration} min`;
            }
        }
    },
    {
        name: 'Suspicion',
        selector: 'inference.suspicion.suspicion_level',
        width: "60px",
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
            loading: false,
            totalRows: 0,
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
        this._loadEventsData();
    }

    _loadEventsData = async () => {
        this.setState({
            loading: true,
        });

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

        this.setState({
            data: response.data.data,
            totalRows: response.data.recordsTotal,
            loading: false,
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
        this.query.startTime = picker.startDate.utc();
        this.query.endTime =  picker.endDate.utc();
        this._loadEventsData();
    };

    _handleSearchEventTypeChange = (eventType) => {
        this.query.eventType =  eventType;
        this._loadEventsData();
    };

    _handleSearchSuspicionChange = (suspicionLevel) => {
        this.query.suspicionLevel =  suspicionLevel;
        this._loadEventsData();
    };

    _handleSearchSearch = (parameters) => {
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
            this.query.startTime = moment.utc(parsed.ts_start, "YYYY-MM-DDTHH:mm");
        }
        if("ts_end" in parsed){
            this.query.endTime = moment.utc(parsed.ts_end, "YYYY-MM-DDTHH:mm");
        }

        this.query.suspicionLevel = translate_suspicion_values_to_str(this.query.min_susp, this.query.max_susp);
        [this.query.min_susp, this.query.max_susp] = translate_suspicion_str_to_values(this.query.suspicionLevel);
    };

    render() {
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
                        data={this.state.data}
                        progressPending={this.state.loading}
                        fixedHeader={true}
                        pagination
                        paginationServer
                        paginationTotalRows={this.state.totalRows}
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