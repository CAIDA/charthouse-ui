import React from "react";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import TagsList from "./tags-list";

const columns1 = [
    {
        name: 'Prefix',
        selector: 'prefix',
    },
    {
        name: 'Tags',
        selector: 'tags',
        wrap: true,
        grow:3,
        cell: row => {
            return <TagsList tags={row.tags} />
        }
    },
    {
        name: 'Traceroute Worthy',
        selector: 'tr_worthy',
    },
    {
        name: 'Traceroute Available',
        selector: 'tr_available',
    },
];
const columns2 = [
    {
        name: 'Sub Prefix',
        selector: 'sub_pfx',
    },
    {
        name: 'Super Prefix',
        selector: 'super_pfx',
    },
    {
        name: 'Tags',
        selector: 'tags',
        wrap: true,
        cell: row => {
            return <TagsList tags={row.tags} />
        }
    },
    {
        name: 'Traceroute Worthy',
        selector: 'tr_worthy',
    },
    {
        name: 'Traceroute Available',
        selector: 'tr_available',
    },
];

class PfxEventsTable extends React.Component {

    static propTypes = {
        enableClick: PropTypes.bool,
        enablePagination: PropTypes.bool,
    };

    static defaultProps = {
        enableClick: true,
        enablePagination: true,
    };

    /**
     * Preprocess incoming event data
     * @param data event data
     * @returns {*}
     */
    preprocessData(pfx_events) {

        let processed = [];

        for (let pfx_event of pfx_events) {
            let event = {};

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
            event.tags = pfx_event.tags.map(tag => <span key={tag}>{tag} </span>);
            event.tr_worthy = pfx_event.tr_worthy.toString();
            event.tr_available = pfx_event.tr_available.toString();
            event.fingerprint = prefixes.join("_")
                .replace(/\//g, "-");

            processed.push(event);
        }
        return processed;
    }


    handleRowClick = (row) => {
        if (this.props.enableClick) {
            window.open(`/feeds/hijacks/events/${this.props.eventType}/${this.props.eventId}/${row.fingerprint}`, "_self");
        }
    };

    render() {
        let data = this.preprocessData(this.props.data);

        let columns = [];
        if (["moas", "edges"].includes(this.props.eventType)) {
            columns = columns1
        } else {
            columns = columns2
        }

        return (
            <DataTable
                columns={columns}
                striped={true}
                pointerOnHover={true}
                highlightOnHover={true}
                data={data}
                onRowClicked={this.handleRowClick}
                pagination={this.props.enablePagination}
            />
        );
    }
}

export default PfxEventsTable;
