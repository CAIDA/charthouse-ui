import React from 'react';
import DataTable from "react-data-table-component";

const columns = [
    {
        name: 'Measurements ID',
        selector: 'msm_id',
    },
    {
        name: 'Target ASN',
        selector: 'target_asn',
    },
    {
        name: 'Target IP',
        selector: 'target_ip',
    },
    {
        name: 'Traget Prefix',
        selector: 'target_pfx',
    },
    {
        name: 'Results (from RIPE)',
        cell: row => <React.Fragment>
            <a href={`https://atlas.ripe.net/measurements/${row.msm_id}`} target={"_blank"}> RIPE Atlas Result </a>
        </React.Fragment>
    }
];

class TraceroutesTable extends React.Component {

    render() {
        return (
            <DataTable
                title="Traceroute Results"
                columns={columns}
                data={this.props.data}
                pagination={false}
            />
        );
    }
}

export default TraceroutesTable;
