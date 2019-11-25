import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import axios from "axios";
import SankeyGraph from "../../../../Hijacks/components/sankeyGraph";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";
import TraceroutesTable from "../../../../Hijacks/components/traceroutes-table";

const HORIZONTAL_OFFSET = 480;

class PfxEventDetails extends React.Component {

    state = {
        eventData: {},
        pfxEventData: {},
        subpaths: [],
        superpaths: [],
        pfxEvents: [],
        tr_aspaths: [],
        tr_results: [],
        loadingEvent: true,
        loadingPfxEvent: true,
    };

    constructor(props) {
        super(props);
        this.eventId = this.props.match.params.eventId;
        this.fingerprint = this.props.match.params.pfxEventId;
        this.eventType = this.eventId.split("-")[0];
    }

    componentDidMount() {
        this.loadEventData();
        this.loadPfxEventData();
    }

    loadEventData = async() => {
        const response = await axios.get(`https://bgp.caida.org/json/event/id/${this.eventId}`);
        this.setState({
            loadingEvent: false,
            eventData: response.data,
        })
    };

    loadPfxEventData = async () => {
        const response = await axios.get(
            `https://bgp.caida.org/json/pfx_event/id/${this.eventId}/${this.fingerprint}`,
        );

        let subpaths = [];
        let superpaths = [];

        if (["submoas", "defcon"].includes(this.eventType)) {
            // if this is a submoas or defcon events, we should show two sankey graphs
            subpaths = response.data.details.sub_aspaths.split(":").map(path => path.split(" "));
            superpaths = response.data.details.super_aspaths.split(":").map(path => path.split(" "));
        } else {
            subpaths = response.data.details.aspaths.split(":").map(path => path.split(" "));
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

        let msms = response.data.traceroutes.msms;
        let as_routes = [];
        if (msms.length > 0) {
            msms.forEach(function (traceroute) {
                if ("results" in traceroute) {
                    traceroute["results"].forEach(function (result) {
                        let as_traceroute = result["as_traceroute"];
                        if (as_traceroute.length !== 0) {
                            let tr_path = result["as_traceroute"].filter(asn => asn !== "*");
                            if (tr_path.length === 0) {
                                console.log(`error as tr path: '${tr_path}', from ${result["as_traceroute"]}`);
                            } else {
                                as_routes.push(tr_path);
                            }
                        }
                    });
                }
            });
        }

        this.setState({
            pfxEventData: response.data,
            subpaths: subpaths,
            superpaths: superpaths,
            pfxEvents: [pfxEvent],
            tr_aspaths: as_routes,
            tr_results: msms,
            loadingPfxEvent: false,
        });
    };

    render() {
        let showTrResults = this.state.tr_results.length > 0;

        let sankeyGraphs;

        if (["submoas", "defcon"].includes(this.eventType)) {
            sankeyGraphs =
                <React.Fragment>
                    <SankeyGraph data={this.state.subpaths} title={"Route Collectors Sankey Diagram - Sub Prefix"}/>
                    <SankeyGraph data={this.state.superpaths} title={"Route Collectors Sankey Diagram - Super Prefix"}/>
                </React.Fragment>

        } else {
            sankeyGraphs =
                <React.Fragment>
                    <SankeyGraph data={this.state.subpaths} title={"Route Collectors Sankey Diagram"}/>
                </React.Fragment>
        }

        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1>Prefix Event Details</h1>
                    </div>
                </div>

                {!this.state.loadingEvent &&
                    <div className="row">
                        <EventDetailsTable data={this.state.eventData}/>
                    </div>
                }

                {!this.state.loadingPfxEvent &&
                    // pfx event loading finished

                    <React.Fragment>
                        <div className="row">
                            <PfxEventsTable
                                data={this.state.pfxEvents}
                                eventType={this.eventType}
                                eventId={this.eventId}
                                enableClick={false} enablePagination={false}/>

                            <div className="col-lg-12">
                                <a target='_blank' type="button" className="btn btn-sm btn-primary"
                                   href={`https://bgp.caida.org/json/pfx_event/id/${this.eventId}/${this.fingerprint}`}>
                                    Raw JSON</a>

                            </div>
                        </div>

                        { showTrResults &&
                        <div className="row">
                            <React.Fragment>
                                <TraceroutesTable data={this.state.tr_results}/>
                                <SankeyGraph title={"Traceroutes Sankey"} data={this.state.tr_aspaths}/>
                            </React.Fragment>
                        </div>
                        }

                        <div className="row">
                            {sankeyGraphs}
                        </div>
                    </React.Fragment>
                }
            </div>
        );
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default PfxEventDetails;
