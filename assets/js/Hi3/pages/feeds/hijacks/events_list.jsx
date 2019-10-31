import React from 'react';
import {Button} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router-dom';

import EventTypeSelector from 'Hijacks/components/event-type-selector';
import {HI3} from 'Hi3/utils';

import 'Hi3/css/pages/feeds/hijacks.css';
import EventsTable from "../../../../Hijacks/components/events-table";

const HORIZONTAL_OFFSET = 480;

class EventsList extends React.Component {

    state = {
        eventType: 'moas',
        vizType: 'feed',
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
                {/*<div className='col-lg-offset-1 col-lg-5 col-md-6 stats-header'>*/}
                {/*    /!*<statstable eventtype={this.state.eventtype}/>*!/*/}
                {/*    <DataProvider/>*/}
                {/*</div>*/}

            </div>
            <div className='row'>
                <div className='col-md-12'>

                    {/* TODO: refactor into separate class (in this file) */}
                    {/*
                    <div style={{display: 'inline-block', marginRight: '25px'}}>
                        <label style={{display: 'block'}}>
                            Select visualization
                        </label>
                        <ToggleButtonGroup type="radio" name="vizType"
                                           value={this.state.vizType}
                                           onChange={this._changeVizType}
                        >
                            <ToggleButton value='feed' id='feed'
                                          onClick={this._changeVizType}>Event Feed</ToggleButton>
                            <ToggleButton value='timeseries' id='timeseries'
                                          onClick={this._changeVizType}>Time Series Graphs</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
*/}

                    <EventTypeSelector eventType={this.state.eventType}
                                       onChange={this._typeChanged}
                    />

                    <div style={{display: 'inline-block', marginLeft: '25px'}}>
                        <LinkContainer to='/explorer'>
                            <Button>Correlate</Button>
                        </LinkContainer>
                    </div>
                </div>
            </div>

            {/*<script src="//stat.ripe.net/widgets/widget_api.js"></script>*/}
            {/*<div className="statwdgtauto">*/}
            {/*    <script>ripestat.init("as-path-length",{"resource":"AS3333"})*/}
            {/*    </script>*/}
            {/*</div>*/}

            <EventsTable eventType={this.state.eventType}/>

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
        console.log("event type changed to %s", eventType);
        this.setState({eventType});
    };
}

export default EventsList;
