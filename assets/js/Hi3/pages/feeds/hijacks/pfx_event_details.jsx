import React from 'react';
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import axios from "axios";

const HORIZONTAL_OFFSET = 480;

class PfxEventDetails extends React.Component {

    state = {
        frameWidth: window.innerWidth - HORIZONTAL_OFFSET
    };

    constructor(props) {
        super(props);
        this.eventTable = React.createRef();

        this.eventId = this.props.match.params.eventId;
        this.prefixes = this.props.match.params.pfxEventId
            .split("_").map(pfx => pfx.replace(/-/g, "/"));
        this.eventType = this.eventId.split("-")[0];
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this.loadEventData()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
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
            </div>
        );
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default PfxEventDetails;
