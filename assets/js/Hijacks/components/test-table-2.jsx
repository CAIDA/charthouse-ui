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
    let d = new Date(unix_time * 1000);
    let year = d.getUTCFullYear();
    let month = zeroPad(d.getUTCMonth(), 2);
    let day = zeroPad(d.getUTCDate(), 2);
    let hour = zeroPad(d.getUTCHours(), 2);
    let minute = zeroPad(d.getUTCMinutes(), 2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

const columns = [
    {
        name: 'Potential Victims',
        selector: 'victims',
        cell: row => {
            let data = row.victims;
            return data.join(",")
        }
    },
    {
        name: 'Potential Attackers',
        selector: 'attackers',
    },
    // {
    //     name: 'Largest Prefix',
    //     selector: 'prefixes',
    // },
    // {
    //     name: '# Prefix Events',
    //     selector: 'prefixes',
    // },
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

class TestTable2 extends React.Component {
    state = {
        data: [],
        loading: false,
        totalRows: 0,
        perPage: 10,
    };

    async componentDidMount() {
        const {perPage} = this.state;

        this.setState({loading: true});

        const response = await axios.get(
            `https://bgp.caida.org/json/events/moas?length=10`,
        );
        console.log(response);

        this.setState({
            data: response.data.data,
            totalRows: response.data.recordsTotal,
            loading: false,
        });
    }

    handlePageChange = async page => {
        const {perPage} = this.state;

        this.setState({loading: true});

        const response = await axios.get(
            `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,
        );

        this.setState({
            loading: false,
            data: response.data.data,
        });
    };

    handlePerRowsChange = async (perPage, page) => {
        this.setState({loading: true});

        const response = await axios.get(
            `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,
        );

        this.setState({
            loading: false,
            data: response.data.data,
            perPage,
        });
    };

    render() {
        const {loading, data, totalRows} = this.state;

        return (
            <DataTable
                title="Users"
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={this.handlePerRowsChange}
                onChangePage={this.handlePageChange}
            />
        );
    }
}

export default TestTable2;