import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'Hijacks/css/hijacks.css';
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
        width: "80px",
    },
];

class EventsTable extends React.Component {
    static propTypes = {
        eventType: PropTypes.string,
    };
    static defaultProps = {
        eventType: "moas",
    };

    state = {
        data: [],
        loading: false,
        // datatable states
        totalRows: 0,
        perPage: 10,
        curPage: 0,

        // event search states
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

        this.state.startTime = moment().utc().startOf('day');
        this.state.endTime = moment().utc();

        this._loadEventsData = this._loadEventsData.bind(this);

        this._handleTablePageChange = this._handleTablePageChange.bind(this);
        this._handleTableRowsChange = this._handleTableRowsChange.bind(this);
        this._handleTableRowClick = this._handleTableRowClick.bind(this);

        this._handleSearchSearch = this._handleSearchSearch.bind(this);
        this._handleSearchTimeChange = this._handleSearchTimeChange.bind(this);
        this._handleSearchSuspicionChange = this._handleSearchSuspicionChange.bind(this);
        this._handleSearchEventTypeChange = this._handleSearchEventTypeChange.bind(this);
    }

    componentDidMount() {
        this._loadEventsData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.eventType === this.props.eventType) {
            return
        }
        this._loadEventsData()
    }

    async _loadEventsData(
    ) {
        this.setState({
            loading: true,
        });

        let [min_susp, max_susp] = translate_suspicion_level(this.state.suspicionLevel);

        let url = `https://bgp.caida.org/json/events/${this.state.eventType}?length=${this.state.perPage}` +
            `&start=${this.state.perPage * this.state.curPage}` +
            `&ts_start=${this.state.startTime.format("YYYY-MM-DDTHH:mm")}` +
            `&ts_end=${this.state.endTime.format("YYYY-MM-DDTHH:mm")}` +
            `&min_susp=${min_susp}` +
            `&max_susp=${max_susp}` +
            "";

        if(this.state.pfxs.length>0){
            url+=`&pfxs=${this.state.pfxs}`
        }
        if(this.state.asns.length>0){
            url+=`&asns=${this.state.asns}`
        }
        if(this.state.tags.length>0){
            url+=`&tags=${this.state.tags}`
        }

        console.log(url);
        const response = await axios.get(url);

        this.setState({
            data: response.data.data,
            totalRows: response.data.recordsTotal,
            loading: false,
        });
    }

    /*
     *************************
     * TABLE EVENTS HANDLERS
     *************************
     */

    _handleTablePageChange(page){
        this.state.curPage = page - 1;
        this._loadEventsData();
    };

    _handleTableRowsChange(perPage, page){
        this.state.perPage = perPage;
        this.state.curPage = page - 1;
        this._loadEventsData();
    };

    _handleTableRowClick(row) {
        // redirect to sub pages
        window.open(`/feeds/hijacks/events/${row.event_type}/${row.id}`, "_self");
    }

    /*
     ******************************
     * SEARCH-BAR EVENTS HANDLERS
     ******************************
     */

    _handleSearchTimeChange(event, picker) {
        this.setState({
            startTime: picker.startDate.utc(),
            endTime: picker.endDate.utc(),
        });
        this._loadEventsData()
    }

    _handleSearchEventTypeChange(eventType) {
        this.state.eventType =  eventType;
        this._loadEventsData()
    }

    _handleSearchSuspicionChange(suspicionLevel) {
        this.state.suspicionLevel =  suspicionLevel;
        this._loadEventsData()
    }

    _handleSearchSearch(parameters) {
        this.state.pfxs =  parameters.pfxs;
        this.state.asns =  parameters.asns;
        this.state.tags =  parameters.tags;
        this._loadEventsData()
    }

    render() {

        return (
            <React.Fragment>
                <SearchBar
                    startDate={this.state.startTime}
                    endDate={this.state.endTime}
                    onTimeChange={this._handleSearchTimeChange}

                    eventType={this.state.eventType}
                    onEventTypeChange={this._handleSearchEventTypeChange}

                    eventSuspicion={this.state.suspicionLevel}
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

export default EventsTable;