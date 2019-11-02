import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import axios from "axios";
import SankeyGraph from "../../../../Hijacks/components/sankeyGraph";

const HORIZONTAL_OFFSET = 480;

class PfxEventDetails extends React.Component {

    state = {
        frameWidth: window.innerWidth - HORIZONTAL_OFFSET
    };

    constructor(props) {
        super(props);
        this.eventTable = React.createRef();
        this.routesSankey = React.createRef();

        this.eventId = this.props.match.params.eventId;
        this.fingerprint = this.props.match.params.pfxEventId;
        this.eventType = this.eventId.split("-")[0];
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
        } else {
            let aspaths = response.data.details.aspaths.split(":").map(path => path.split(" "));
            this.routesSankey.current.loadData(aspaths);
        }
    }

    async loadEventData() {
        const response = await axios.get(
            `https://bgp.caida.org/json/event/id/${this.eventId}`,
        );
        this.eventTable.current.loadEventData(response.data);

    }

    render() {
        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1>Prefix Event Details</h1>
                    </div>
                </div>
                <div>
                    <EventDetailsTable ref={this.eventTable}/>
                </div>
                <div>
                    <SankeyGraph ref={this.routesSankey}/>
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
