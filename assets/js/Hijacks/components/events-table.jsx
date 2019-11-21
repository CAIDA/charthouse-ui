import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'Hijacks/css/hijacks.css';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";
import queryString from 'query-string'
import PropTypes from 'prop-types';
import React from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import SearchBar from "./search-bar";
import {translate_suspicion_level} from "../utils/events";
import AsNumber from "./asn";

function unix_time_to_str(unix_time) {
    if (unix_time === null) {
        return ""
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
            return maxpfx
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
                return "ongoing"
            } else {
                let duration = (row.finished_ts - row.view_ts) / 60;
                if (duration < 0) {
                    console.log("negative duration for event");
                    console.log(row);
                    duration = 0;
                }
                return `${duration} min`
            }
        }
    },
    {
        name: 'Type',
        selector: 'event_type',
        width: "120px",
    },
    {
        name: 'Suspicion',
        selector: 'inference.suspicion.suspicion_level',
        width: "120px",
    },
];

class EventsTable extends React.Component {

    state = {
        data: [],
        loading: false,
        totalRows: 0,
    };

    query = {
        perPage: 10,
        curPage: 0,
        startTime: 0,
        endTime: 0,
        eventType: "moas",
        suspicionLevel: "suspicious",
        pfxs: [],
        asns: [],
        tags: [],
    };

    constructor(props) {
        super(props);

        this.query.startTime = moment().utc().subtract(1, "days");
        this.query.endTime = moment().utc();
        this._parseQueryString();

        this.history = createBrowserHistory();

    }

    componentDidMount() {
        this._loadEventsData();
    }

    _loadEventsData = async () => {
        this.setState({
            loading: true,
        });

        let [min_susp, max_susp] = translate_suspicion_level(this.query.suspicionLevel);

        let baseUrl = `https://bgp.caida.org/json/events?`;

        let params = new URLSearchParams();
        params.append("length", this.query.perPage);
        params.append("start", this.query.perPage * this.query.curPage);
        params.append("ts_start", this.query.startTime.format("YYYY-MM-DDTHH:mm"));
        params.append("ts_end", this.query.endTime.format("YYYY-MM-DDTHH:mm"));
        params.append("min_susp", min_susp);
        params.append("max_susp", max_susp);

        if(this.query.eventType!=="all"){
            params.append("event_type", this.query.eventType);
        }
        if(this.query.pfxs.length>0){
            params.append("pfxs", this.query.pfxs)
        }
        if(this.query.asns.length>0){
            params.append("asns", this.query.asns)
        }
        if(this.query.tags.length>0){
            params.append("tags", this.query.tags)
        }

        let url = baseUrl + params.toString();
        this.history.push(this.history.location.pathname + `?${params}`);

        console.log(url);
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
        this.setState({
            startTime: picker.startDate.utc(),
            endTime: picker.endDate.utc(),
        });
        this._loadEventsData()
    };

    _handleSearchEventTypeChange = (eventType) => {
        this.query.eventType =  eventType;
        this._loadEventsData()
    };

    _handleSearchSuspicionChange = (suspicionLevel) => {
        this.query.suspicionLevel =  suspicionLevel;
        this._loadEventsData()
    };

    _handleSearchSearch = (parameters) => {
        this.query.pfxs =  parameters.pfxs;
        this.query.asns =  parameters.asns;
        this.query.tags =  parameters.tags;

        console.log(this.history.location);
        this._loadEventsData()
    };

    _parseQueryString = () => {
        const parsed = queryString.parse(location.search);
        if("pfxs" in parsed){
            parsed.pfxs = parsed.pfxs.split(",")
        }
        if("tags" in parsed){
            parsed.tags = parsed.tags.split(",")
        }
        if("asns" in parsed){
            parsed.asns = parsed.asns.split(",")
        }
        this.query = Object.assign(this.query, parsed);
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