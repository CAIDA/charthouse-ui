import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
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
        name: 'Prefix',
        selector: 'prefix',
    },
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
    static propTypes = {
        eventId: PropTypes.string,
        eventType: PropTypes.string,
    };

    state = {
        data: {},
        loading: true,
        success: false,
        error_msg: "",
    };

    async componentDidMount() {
        const response = await axios.get(
            `https://bgp.caida.org/json/event/id/${this.props.eventId}`,
        );
        if ("error" in response.data) {
            this.setState({
                loading: false,
                success: false,
                error_msg: response.data.error
            });
            return;
        }

        this.setState({
            data: this.preprocessData(response.data),
            loading: false,
            success: true,
        });
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
            if ("prefix" in pfx_event) {
                event.prefix = pfx_event.prefix;
            }
            if ("sub_pfx" in pfx_event) {
                event.sub_pfx = pfx_event.sub_pfx;
            }
            if ("super_pfx" in pfx_event) {
                event.super_pfx = pfx_event.super_pfx;
            }
            event.tags = pfx_event.tags.map(tag => <span key={tag}>{tag} </span>);
            event.tr_worthy = pfx_event.tr_worthy.toString();
            event.tr_available = pfx_event.tr_available.toString();

            processed.push(event);
            console.log(event)
        }
        return processed;
    }

    render() {
        const {loading, data, totalRows} = this.state;
        console.log("redner pfx table");
        console.log(data);
        console.log(this.props);
        if (loading) {
            return (<div>loading data ...</div>)
        }

        let columns = [];
        if (["moas", "edges"].includes(this.props.eventType)) {
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
                pagination
            />
        );
    }
}

export default PfxEventsTable;
