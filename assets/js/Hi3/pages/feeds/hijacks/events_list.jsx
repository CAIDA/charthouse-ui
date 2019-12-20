import React from 'react';
import {Link} from 'react-router-dom';

import {HI3} from 'Hi3/utils';

import 'Hi3/css/pages/feeds/hijacks.css';
import EventsTable from "../../../../Hijacks/components/events-table";

const HORIZONTAL_OFFSET = 480;

class EventsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventType: 'moas',
            vizType: 'feed',
            frameWidth: window.innerWidth - HORIZONTAL_OFFSET
        };

    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {

        return <div id='hijacks' className='container-fluid'>
            <div className='row header'>
                <div className='col-md-12 page-header'>
                    <h1>BGP Hijacks Observatory</h1>
                    <p className='lead'>
                        The <a href="https://www.caida.org/funding/hijacks">BGP Hijacks Observatory</a> is
                        a <a href="https://www.caida.org">CAIDA</a> project
                        to detect and characterize BGP hijacking attacks,
                        including stealthy man-in-the-middle (MiTM) Internet
                        traffic interception attacks. The Observatory uses
                        the <Link to='/feeds'>{HI3} PaaS</Link> offering
                        to power its data collection and
                        analytics platform, and provides event data to {HI3} to
                        allow correlation with other types of Internet
                        security data.
                    </p>
                </div>
            </div>

            <EventsTable/>

        </div>;
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };

    _changeVizType = (e) => {
        this.setState({vizType: e.target.id});
    };

    _typeChanged = (eventType) => {
        this.setState({eventType});
    };
}

export default EventsList;
