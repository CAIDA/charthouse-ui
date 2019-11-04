import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import axios from "axios";
import SankeyGraph from "../../../../Hijacks/components/sankeyGraph";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";

const HORIZONTAL_OFFSET = 480;

class PfxEventDetails extends React.Component {

    state = {
        frameWidth: window.innerWidth - HORIZONTAL_OFFSET,
        tr_available: false,
    };

    constructor(props) {
        super(props);
        this.eventTable = React.createRef();
        this.routesSankey = React.createRef();
        this.routesSankey2 = React.createRef();
        this.pfxEventTable = React.createRef();
        this.tracerouteSankey = React.createRef();

        this.eventId = this.props.match.params.eventId;
        this.fingerprint = this.props.match.params.pfxEventId;
        this.eventType = this.eventId.split("-")[0];

        this.trResults = this.trResults.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this.loadEventData();
        this.loadPfxEventData();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    async loadPfxEventData() {
        const response = await axios.get(
            `https://bgp.caida.org/json/pfx_event/id/${this.eventId}/${this.fingerprint}`,
        );

        console.log(response);
        if (["submoas", "defcon"].includes(this.eventType)) {
            // if this is a submoas or defcon events, we should show two sankey graphs
            let subpaths = response.data.details.sub_aspaths.split(":").map(path => path.split(" "));
            let superpaths = response.data.details.super_aspaths.split(":").map(path => path.split(" "));
            this.routesSankey.current.loadData(subpaths);
            this.routesSankey2.current.loadData(superpaths);
        } else {
            let aspaths = response.data.details.aspaths.split(":").map(path => path.split(" "));
            this.routesSankey.current.loadData(aspaths);
        }

        let data = response.data;
        let pfxEvent = {
            "tags": data.tags,
            "tr_worthy": data.traceroutes.worthy,
            "tr_available": data.traceroutes.msms.length > 0,
            "fingerprint": this.fingerprint,
        };
        if ("prefix" in data.details) {
            pfxEvent.prefix = data.details.prefix
        }
        if ("sub_pfx" in data.details) {
            pfxEvent.sub_pfx = data.details.sub_pfx
        }
        if ("super_pfx" in data.details) {
            pfxEvent.super_pfx = data.details.super_pfx
        }
        this.pfxEventTable.current.loadEventData([pfxEvent], this.eventType, this.eventId, response.error);


        if (response.data.traceroutes.msms.length > 0) {
            this.setState({"tr_available": false})
        } else {
            this.setState({"tr_available": true})
        }
    }

    async loadEventData() {
        const response = await axios.get(
            `https://bgp.caida.org/json/event/id/${this.eventId}`,
        );
        this.eventTable.current.loadEventData(response.data);

    }

    trResults(trAvailable) {
        if (!trAvailable) {
            console.log("traceroute results not available");
            return null
        }
        console.log("traceroute results available");
    }

    sankeyGraphs(eventType) {
        if (["submoas", "defcon"].includes(eventType)) {
            return (
                <React.Fragment>
                    <SankeyGraph ref={this.routesSankey} title={"Route Collectors Sankey Diagram - Sub Prefix"}/>
                    <SankeyGraph ref={this.routesSankey2} title={"Route Collectors Sankey Diagram - Super Prefix"}/>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <SankeyGraph ref={this.routesSankey} title={"Route Collectors Sankey Diagram"}/>
                </React.Fragment>
            )
        }
    }

    render() {
        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1>Prefix Event Details</h1>
                    </div>
                </div>

                <div className="row">
                    <EventDetailsTable ref={this.eventTable}/>
                </div>
                <div className="row">
                    <PfxEventsTable ref={this.pfxEventTable} enableClick={false} enablePagination={false}/>
                </div>

                <div className="row">
                    {this.sankeyGraphs(this.eventType)}
                </div>

                <div className="row">
                    {this.trResults(this.state.tr_available)}
                </div>
            </div>
        );
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default PfxEventDetails;
