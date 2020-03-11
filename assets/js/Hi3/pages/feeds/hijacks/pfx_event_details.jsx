import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import axios from "axios";
import SankeyGraph from "../../../../Hijacks/components/sankeyGraph";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";
import TraceroutesTable from "../../../../Hijacks/components/traceroutes-table";

const HORIZONTAL_OFFSET = 480;

class PfxEventDetails extends React.Component {

    constructor(props) {
        super(props);
        this.eventId = this.props.match.params.eventId;
        this.jsonUrl = `https://bgp.caida.org/json/event/id/${this.eventId}`;
        this.fingerprint = this.props.match.params.pfxEventId;
        this.eventType = this.eventId.split("-")[0];
        this.state = {
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
            "details": data.details,
            "tags": data.tags,
            "tr_worthy": data.traceroutes.worthy,
            "tr_available": data.traceroutes.msms.length > 0,
            "fingerprint": this.fingerprint,
        };
        if ("prefix" in data.details) {
            pfxEvent.prefix = data.details.prefix;
        }
        if ("sub_pfx" in data.details) {
            pfxEvent.sub_pfx = data.details.sub_pfx;
        }
        if ("super_pfx" in data.details) {
            pfxEvent.super_pfx = data.details.super_pfx;
        }

        let msms = response.data.traceroutes.msms;
        let msms_filtered = []; // store good to use traceroute results
        let targets = new Set(msms.map(msm=>msm["target_asn"]));
        let as_routes = [];
        if (msms.length > 0) {
            msms.forEach(function (traceroute) {
                if ("results" in traceroute && Object.keys(traceroute["results"]).length > 0) {
                    traceroute["results"].forEach(function (result) {
                        let as_traceroute = result["as_traceroute"];
                        if (as_traceroute.length !== 0) {
                            let raw_path = result["as_traceroute"];
                            let tr_path = [];
                            // properly render missing traceroute nodes
                            for(let i = 0; i < raw_path.length; i++){
                                let asn = raw_path[i];
                                if(asn!=="*"){
                                    tr_path.push(asn);
                                } else {
                                    if(i===raw_path.length -1){
                                        // if * appears as the last hop
                                        tr_path.push(`*`.replace(" ","_"));
                                    } else {
                                        tr_path.push(`*_${raw_path[i+1]}`.replace(" ","_"));
                                    }
                                }
                            }
                            // push an extra * if the last hop isn't one of the target ASN
                            let last_hop = tr_path[tr_path.length-1];
                            if(last_hop !== "*" && !targets.has(last_hop)){
                                tr_path.push("*");
                            }
                            if (tr_path.length === 0) {
                                console.log(`error as tr path: '${tr_path}', from ${result["as_traceroute"]}`);
                            } else {
                                as_routes.push(tr_path);
                            }
                        }
                    });
                    msms_filtered.push(traceroute);
                }
            });
        }

        this.setState({
            pfxEventData: response.data,
            subpaths: subpaths,
            superpaths: superpaths,
            pfxEvents: [pfxEvent],
            tr_aspaths: as_routes,
            tr_results: msms_filtered,
            loadingPfxEvent: false,
        });
    };

    render() {
        let showTrResults = this.state.tr_results.length > 0;
        console.log(this.state.tr_results);

        let sankeyGraphs;

        if (["submoas", "defcon"].includes(this.eventType)) {
            sankeyGraphs =
                <React.Fragment>
                    <SankeyGraph
                        data={this.state.subpaths}
                        title={"Route Collectors AS Path Sankey Diagram - Sub Prefix"}
                        id={"sub_sankey"}
                        highlights={[]}
                        benign_nodes={this.state.eventData.victims}
                        suspicious_nodes={this.state.eventData.attackers}
                    />
                    <SankeyGraph
                        data={this.state.superpaths}
                        title={"Route Collectors AS Path Sankey Diagram - Super Prefix"}
                        id={"super_sankey"}
                        highlights={[]}
                        benign_nodes={this.state.eventData.victims}
                        suspicious_nodes={this.state.eventData.attackers}
                    />
                </React.Fragment>

        } else {
            let highlights = [];
            if(this.eventType==="edges"){
                highlights.push(this.eventId.split("-")[2].split("_"))
            }
            // edges and moas
            sankeyGraphs =
                <React.Fragment>
                    <SankeyGraph
                        data={this.state.subpaths}
                        title={"Route Collectors AS Path Sankey Diagram"}
                        highlights={highlights}
                        id={"pfx_sankey"}
                        benign_nodes={this.state.eventData.victims}
                        suspicious_nodes={this.state.eventData.attackers}
                    />
                </React.Fragment>
        }

        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1><a href={`/feeds/hijacks/events/${this.state.eventData.event_type}/${this.state.eventData.id}`}> 	&#128281; </a></h1>
                        <h1>Prefix Event Details</h1>
                    </div>
                </div>

                {!this.state.loadingEvent &&
                    <div className="row">
                        <EventDetailsTable data={this.state.eventData} jsonUrl={this.jsonUrl}/>
                    </div>
                }

                {!this.state.loadingPfxEvent &&
                    // pfx event loading finished

                    <React.Fragment>
                        <div className="row">
                            <PfxEventsTable
                                data={this.state.pfxEvents}
                                inference={this.state.eventData.inference}
                                eventType={this.eventType}
                                eventId={this.eventId}
                                isEventDetails={false}
                                enableClick={false} enablePagination={false}
                            />

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
                                <SankeyGraph
                                    title={"Traceroutes Sankey"}
                                    data={this.state.tr_aspaths}
                                    highlights={[]}
                                    id={"tr_sankey"}
                                    benign_nodes={this.state.eventData.victims}
                                    suspicious_nodes={this.state.eventData.attackers}
                                />
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
