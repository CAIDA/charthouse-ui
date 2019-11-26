import React from 'react';
import axios from "axios";
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";

const HORIZONTAL_OFFSET = 480;

class EventDetails extends React.Component {

    state = {
        loading: true,
        data: undefined,
    };

    constructor(props) {
        super(props);
        this.pfxTable = React.createRef();

        this.eventId = this.props.match.params.eventId;
        this.eventType = this.eventId.split("-")[0];
        this.jsonUrl = `https://bgp.caida.org/json/event/id/${this.eventId}`;
        console.log(this.jsonUrl);
    }

    async componentDidMount() {
        this.loadEventData();
    }

    async loadEventData() {
        const response = await axios.get(this.jsonUrl);
        // this.pfxTable.current.loadEventData(response.data.pfx_events, this.eventType, this.eventId, response.data.error);
        this.setState({
            loading: false,
            data: response.data,
        })
    }

    render() {
        const {loading, data} = this.state;

        if(loading){
            return(
                <div>
                    loading event data ...
                </div>
            )
        }
        if("error" in data){
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

        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1>Event Details</h1>
                    </div>
                </div>
                <div>
                    <EventDetailsTable data={this.state.data} jsonUrl={this.jsonUrl}/>
                </div>
                <div>
                    <PfxEventsTable data={this.state.data.pfx_events}
                                    inference={this.state.data.inference}
                                    eventId={this.eventId}
                                    eventType={this.eventType}
                                    title={"Prefix Event List"}
                    />
                </div>
            </div>
        );
    }
}

export default EventDetails;
