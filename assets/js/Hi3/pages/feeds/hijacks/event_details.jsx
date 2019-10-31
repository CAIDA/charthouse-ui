import React from 'react';
import axios from "axios";
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";

const HORIZONTAL_OFFSET = 480;

class EventDetails extends React.Component {

    state = {
        frameWidth: window.innerWidth - HORIZONTAL_OFFSET
    };

    constructor(props) {
        super(props);
        this.pfxTable = React.createRef();
        this.eventTable = React.createRef();

        this.eventId = this.props.match.params.eventId;
        console.log(this.eventId);
        this.eventType = this.eventId.split("-")[0];
    }

    async componentDidMount() {
        window.addEventListener('resize', this._resize);
        this.loadEventData();

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    async loadEventData() {
        console.log("loading event data now");
        const response = await axios.get(
            `https://bgp.caida.org/json/event/id/${this.eventId}`,
        );
        console.log(response.data);

        this.pfxTable.current.loadEventData(response.data);
        this.eventTable.current.loadEventData(response.data);
    }

    render() {

        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1>Event Details</h1>
                    </div>
                </div>
                <div>
                    <EventDetailsTable ref={this.eventTable}/>
                </div>
                <div>
                    <PfxEventsTable ref={this.pfxTable}/>
                </div>
            </div>
        );
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default EventDetails;
