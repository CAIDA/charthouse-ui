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

function zeroPad(num, places) {
    return String(num).padStart(places, '0')
}

function unix_time_to_str(unix_time) {
    if (unix_time === null) {
        return ""
    }
    return moment(unix_time * 1000).utc().format("YYYY-MM-DD HH:mm");
}

const columns = [
    {
        name: 'Potential Victims',
        selector: 'victims',
        grow: 1,
        cell: row => {
            let data = row.victims;
            let res = data.slice(0, 2).join(",");
            if (data.length > 2) {
                res += " and more"
            }
            return res
        },
        ignoreRowClick: true,
    },
    {
        name: 'Potential Attackers',
        selector: 'attackers',
        grow: 1,
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
        eventType: "all",
    };

    state = {
        data: [],
        loading: false,
        totalRows: 0,
        perPage: 10,
        curPage: 0,
        startTime: 0,
        endTime: 0,
        timeRangeStr: "",
        suspicionLevel: "suspicious"
    };

    constructor(props) {
        super(props);

        this.state.startTime = moment().startOf('day').utc(true);
        this.state.endTime = moment().utc(true);

        this.state.timeRangeStr = `${this.state.startTime.format()} - ${this.state.endTime.format()}`;

        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.handleSuspicionChange = this.handleSuspicionChange.bind(this);
        this.loadContent = this.loadContent.bind(this);

    }

    componentDidMount() {
        this.loadContent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.eventType === this.props.eventType) {
            return
        }
        this.loadContent()
    }

    async loadContent(
        perPage = this.state.perPage,
        curPage = this.state.curPage,
        ts_start = this.state.startTime,
        ts_end = this.state.endTime,
    ) {
        this.setState({
            loading: true,
            curPage: curPage,
            perPage: perPage,
        });

        let [min_susp, max_susp] = translate_suspicion_level(this.state.suspicionLevel);

        let url = `https://bgp.caida.org/json/events/${this.props.eventType}?length=${perPage}&start=${perPage * curPage}` +
            `&ts_start=${ts_start.format("YYYY-MM-DDTHH:mm")}` +
            `&ts_end=${ts_end.format("YYYY-MM-DDTHH:mm")}` +
            `&min_susp=${min_susp}` +
            `&max_susp=${max_susp}` +
            "";
        console.log(url);

        const response = await axios.get(url);
        console.log(response);

        this.setState({
            data: response.data.data,
            totalRows: response.data.recordsTotal,
            curPage: curPage,
            perPage: perPage,
            loading: false,
        });
    }

    handlePageChange = async page => {
        this.state.curPage = page - 1;
        this.loadContent();
    };

    handlePerRowsChange = async (perPage, page) => {
        this.state.perPage = perPage;
        this.state.curPage = page - 1;
        this.loadContent();
    };

    handleRowClick(row) {
        // redirect to sub pages
        window.open(`/feeds/hijacks/events/${row.event_type}/${row.id}`, "_self");
    }

    handleDateRangeChange(event, picker) {
        this.setState({
            startTime: picker.startDate.utc(),
            endTime: picker.endDate.utc(),
            timeRangeStr: `${picker.startDate.utc(true).format()} - ${picker.endDate.utc(true).format()}`,
        });
        this.loadContent()
    }

    handleSuspicionChange(changeEvent) {
        if (this.state.suspicionLevel !== changeEvent.target.value) {
            this.state.suspicionLevel = changeEvent.target.value;
            console.log(changeEvent.target.value);
            console.log(this.state.suspicionLevel);
            this.loadContent()
        }
    }

    render() {

        return (
            <React.Fragment>
                <SearchBar
                    startDate={this.state.startTime}
                    endDate={this.state.endTime}
                    onTimeChange={this.handleDateRangeChange}
                    timeRangeStr={this.state.timeRangeStr}

                    suspicionLevel={this.state.suspicionLevel}
                    onSuspicionChange={this.handleSuspicionChange}
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
                        onChangeRowsPerPage={this.handlePerRowsChange}
                        onChangePage={this.handlePageChange}
                        onRowClicked={this.handleRowClick}
                    />
                </div>

            </React.Fragment>
        );
    }
}

export default EventsTable;