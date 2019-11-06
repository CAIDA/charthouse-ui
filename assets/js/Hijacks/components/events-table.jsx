import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment'
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';

import 'Hijacks/css/hijacks.css';
import PropTypes from 'prop-types';
import React from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function zeroPad(num, places) {
    return String(num).padStart(places, '0')
}

function unix_time_to_str(unix_time) {
    if (unix_time === null) {
        return ""
    }
    return moment(unix_time * 1000).format("YYYY-MM-DD HH:mm");
}

const columns = [
    {
        name: 'Potential Victims',
        selector: 'victims',
        cell: row => {
            let data = row.victims;
            let res = data.slice(0, 2).join(",");
            if (data.length > 2) {
                res += " and more"
            }
            return res
        },
        ignoreRowClick: true,
        button: true
    },
    {
        name: 'Potential Attackers',
        selector: 'attackers',
    },
    {
        name: 'Largest Prefix',
        selector: 'prefixes',
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
        cell: row => {
            let data = row.prefixes;
            return data.length
        }
    },
    {
        name: 'Start Time',
        selector: 'view_ts',
        cell: row => `${unix_time_to_str(row.view_ts)}`
    },
    {
        name: 'Duration',
        selector: 'finished_ts',
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
        timeRangeStr: ""
    };

    constructor(props) {
        super(props);

        this.ranges = {
            'Today': [
                moment().startOf('day').utc(true),
                moment().utc(true)
            ],
            'Yesterday': [
                moment().subtract(2, 'days').startOf('day').utc(true),
                moment().subtract(1, 'days').startOf('day').utc(true)
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days').startOf('day').utc(true),
                moment().utc(true)
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days').startOf('day').utc(true),
                moment().utc(true)
            ],
            'This Month': [
                moment().startOf('month').utc(true),
                moment().endOf('month').utc(true)
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month').utc(true),
                moment().subtract(1, 'month').endOf('month').utc(true)
            ]
        };

        this.state.startTime = moment().startOf('day').utc(true);
        this.state.endTime = moment().utc(true);

        this.state.timeRangeStr = `${this.state.startTime.format()} - ${this.state.endTime.format()}`;

        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
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

        let url = `https://bgp.caida.org/json/events/${this.props.eventType}?length=${perPage}&start=${perPage * curPage}` +
            `&ts_start=${ts_start.format("YYYY-MM-DDTHH:mm")}` +
            `&ts_end=${ts_end.format("YYYY-MM-DDTHH:mm")}`;
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
        this.loadContent(perPage, page);
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

    render() {

        return (
            <div className={"row"}>
                <div className={"event-list__time"}>
                    <DateRangePicker
                        startDate={this.state.startTime}
                        endDate={this.state.endTime}
                        onApply={this.handleDateRangeChange}
                        ranges={this.ranges}
                        alwaysShowCalendars={true}
                        timePicker={true}
                        timePicker24Hour={true}
                        timePickerIncrement={15}
                    >
                        <a href="#" className="btn btn-info btn-md">
                            <span className="glyphicon glyphicon-calendar"/> Time Range
                        </a>
                    </DateRangePicker>

                    <input
                        readOnly={true}
                        className={"form-control event-list__time-input"}
                        value={this.state.timeRangeStr}
                    />
                </div>

                <DataTable
                    title="Events List"
                    columns={columns}
                    data={this.state.data}
                    progressPending={this.state.loading}
                    pagination
                    paginationServer
                    paginationTotalRows={this.state.totalRows}
                    onChangeRowsPerPage={this.handlePerRowsChange}
                    onChangePage={this.handlePageChange}
                    onRowClicked={this.handleRowClick}
                />
            </div>
        );
    }
}

export default EventsTable;