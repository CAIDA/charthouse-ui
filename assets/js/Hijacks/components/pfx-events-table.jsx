import React from "react";
import DataTable from "react-data-table-component";

const columns1 = [
    {
        name: 'Prefix',
        selector: 'prefix',
    },
    {
        name: 'Tags',
        selector: 'tags',
        wrap: true,
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

    state = {
        data: {},
        loading: true,
        success: false,
        error_msg: "",
    };

    constructor(props) {
        super(props);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    async componentDidMount() {
    }

    /**
     * Preprocess incoming event data
     * @param data event data
     * @returns {*}
     */
    preprocessData(data) {

        let processed = [];

        for (let pfx_event of data.pfx_events) {
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
            console.log(event)
        }
        return processed;
    }


    handleRowClick(row) {
        window.open(`/feeds/hijacks/events/${this.eventId}/${row.fingerprint}`, "_self");
    }

    loadEventData(data) {
        if ("error" in data) {
            this.setState({
                loading: false,
                success: false,
                error_msg: data.error
            });
            return;
        }

        this.eventType = data.event_type;
        this.eventId = data.id;


        this.setState({
            data: this.preprocessData(data),
            loading: false,
            success: true,
        });
    }

    render() {
        const {loading, data, success, error_msg} = this.state;

        if (loading) {
            // still loading
            return (<div>loading data ...</div>)
        }

        if (!success) {
            // loading failed
            return (
                <div>
                    <p>
                        Event details loading failed
                    </p>
                    <p>
                        {error_msg}
                    </p>
                </div>
            )
        }

        let columns = [];
        if (["moas", "edges"].includes(this.eventType)) {
            columns = columns1
        } else {
            columns = columns2
        }

        return (
            <DataTable
                title="Events List"
                columns={columns}
                data={data}
                progressPending={loading}
                onRowClicked={this.handleRowClick}
                pagination
            />
        );
    }
}

export default PfxEventsTable;