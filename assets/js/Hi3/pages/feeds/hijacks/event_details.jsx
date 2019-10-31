import React from 'react';
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
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {

        const {eventid} = this.props.match.params;
        let eventType = eventid.split("-")[0];
        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1>Event Details</h1>
                    </div>
                </div>
                <div>
                    <EventDetailsTable eventId={eventid}/>
                </div>
                <div>
                    <PfxEventsTable eventId={eventid} eventType={eventType}/>
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
