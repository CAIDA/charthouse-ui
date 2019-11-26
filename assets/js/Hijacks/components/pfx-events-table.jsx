import React from "react";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import TagsList from "./tags-list";
import {extract_tags_dict_from_inference} from "../utils/tags";

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
            return <TagsList tags={row.tags_dict} />
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
            return <TagsList tags={row.tags_dict} />
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
    preprocessData(pfx_events, inference) {

        let processed = [];

        let tags_inference_dict = extract_tags_dict_from_inference(inference);

        for (let pfx_event of pfx_events) {
            let event = {};
            let tags_dict={}

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
            event.tags = pfx_event.tags;
            event.tr_worthy = pfx_event.tr_worthy.toString();
            event.tr_available = pfx_event.tr_available.toString();
            event.fingerprint = prefixes.join("_")
                .replace(/\//g, "-");
            pfx_event.tags.forEach((tag_name)=>{
                tags_dict[tag_name] = tag_name in tags_inference_dict? tags_inference_dict[tag_name]: "unknown";
            });
            event.tags_dict=tags_dict;
            processed.push(event);
        }
        console.log(processed);
        return processed;
    }


    handleRowClick = (row) => {
        if (this.props.enableClick) {
            window.open(`/feeds/hijacks/events/${this.props.eventType}/${this.props.eventId}/${row.fingerprint}`, "_self");
        }
    };

    render() {
        let data = this.preprocessData(this.props.data, this.props.inference);
        let columns = [];
        if (["moas", "edges"].includes(this.props.eventType)) {
            columns = columns1
        } else {
            columns = columns2
        }

        return (
            <DataTable
                title={this.props.title}
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
