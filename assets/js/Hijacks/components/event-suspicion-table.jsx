import React from "react";
import TagsList from "./tags-list";
import DataTable from "react-data-table-component";

const columns = [
    {
        name: 'Tags',
        selector: 'tags',
        wrap: true,
        grow:3,
        cell: row => {
            console.log(row.tags);
            return <TagsList tags={row.tags} />
        }
    },
    {
        name: 'Suspicion Level',
        selector: 'suspicion_level',
    },
    {
        name: 'Confidence',
        selector: 'confidence',
    },
    {
        name: 'Explain',
        selector: 'explain',
    },
];

/**
 * This component takes Inference result from event dictionary and visualize with a table
 */
class EventSuspicionTable extends React.Component {


    render() {
        return (
            <DataTable
                columns={columns}
                title={this.props.title}
                striped={true}
                highlightOnHover={true}
                data={this.props.data}
                pagination={false}
            />

    );
    }
}

export default EventSuspicionTable;
