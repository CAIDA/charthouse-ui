import React from 'react';
import axios from "axios";
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";
import EventSuspicionTable from "../../../../Hijacks/components/event-suspicion-table";
import EventTrTagsTable from "../../../../Hijacks/components/event-tr-tags-table";

const HORIZONTAL_OFFSET = 480;

class EventDetails extends React.Component {

    state = {
        loading: true,
        eventData: undefined,
        tagsData: undefined,
    };

    constructor(props) {
        super(props);

        this.eventId = this.props.match.params.eventId;
        this.eventType = this.eventId.split("-")[0];
        this.jsonUrl = `https://bgp.caida.org/json/event/id/${this.eventId}`;
        this.tagsUrl = `https://bgp.caida.org/json/tags`;
    }

    async componentDidMount() {
        this.loadEventData();
        this.loadTagsData();
    }

    async loadEventData() {
        const response = await axios.get(this.jsonUrl);
        this.setState({
            loading: false,
            eventData: response.data,
        })
    }

    async loadTagsData() {
        const response = await axios.get(this.tagsUrl);
        this.setState({
            tagsData: response.data,
        });
    }

    render() {
        const {loading, eventData} = this.state;

        if(loading){
            return(
                <div>
                    loading event data ...
                </div>
            )
        }
        if("error" in eventData){
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
                    <EventDetailsTable data={this.state.eventData} jsonUrl={this.jsonUrl}/>
                </div>

                <div>
                    <EventSuspicionTable suspicion_tags={this.state.eventData.inference.suspicion.suspicion_tags}
                                         all_tags={this.state.eventData.tags}
                                         title={"Tags Suspicion Table"}
                    />
                </div>

                <div>
                    {this.state.tagsData!==undefined &&
                    <EventTrTagsTable eventTags={this.state.eventData.tags}
                                      allTags={this.state.tagsData}
                                      title={"Tags Traceroute Worthiness Table"}
                    />
                    }
                </div>

                <div>
                    <PfxEventsTable data={this.state.eventData.pfx_events}
                                    inference={this.state.eventData.inference}
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
