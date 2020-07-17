/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

import React from 'react';
import axios from "axios";
import 'Hi3/css/pages/feeds/hijacks.css';
import EventDetailsTable from "../../../../Hijacks/components/event-details-table";
import PfxEventsTable from "../../../../Hijacks/components/pfx-events-table";
import EventTrTagsTable from "../../../../Hijacks/components/event-tr-tags-table";
import queryString from "query-string";

class EventDetails extends React.Component {

    constructor(props) {
        super(props);

        this.eventId = this.props.match.params.eventId;
        this.eventType = this.eventId.split("-")[0];
        this.jsonUrl = `https://bgp.caida.org/json/event/id/${this.eventId}`;
        this.tagsUrl = `https://bgp.caida.org/json/tags`;

        this.state = {
            loading: true,
            eventData: undefined,
            tagsData: undefined,
        };

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

        const parsed = queryString.parse(location.search);
        let debug = false;
        if("debug" in parsed || "dbg" in parsed){
            debug = true
        }

        return (
            <div id='hijacks' className='container-fluid'>
                <div className='row header'>
                    <div className='col-md-12 page-header'>
                        <h1><a href={"/feeds/hijacks/events"}> 	&#128281; </a></h1>
                        <h1> Event Details </h1>
                    </div>
                </div>
                <div>
                    <EventDetailsTable data={this.state.eventData} jsonUrl={this.jsonUrl}/>
                </div>


                {/*<div>*/}
                {/*    { debug &&*/}
                {/*    <EventSuspicionTable suspicion_tags={this.state.eventData.inference.suspicion.suspicion_tags}*/}
                {/*                         all_tags={this.state.eventData.tags}*/}
                {/*                         title={"Tags Suspicion Table"}*/}
                {/*    />*/}
                {/*    }*/}
                {/*</div>*/}

                <div>
                    {this.state.tagsData!==undefined && debug &&
                    <EventTrTagsTable eventTags={this.state.eventData.tags}
                                      allTags={this.state.tagsData}
                                      title={"Tags Traceroute Worthiness Table"}
                    />
                    }
                </div>

                <div>
                    <PfxEventsTable data={this.state.eventData.pfx_events}
                                    tagsData={this.state.tagsData}
                                    eventId={this.eventId}
                                    eventType={this.eventType}
                                    isEventDetails={true}
                                    title={"Prefix Event List"}
                    />
                </div>
            </div>
        );
    }
}

export default EventDetails;
