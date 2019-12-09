import React from 'react';

import 'Hijacks/css/hijacks.css';
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import EventTypeSelector from "./components/event-type-selector";

class HijacksDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventType: 'moas',
            vizType: 'feed',
        };

    }

    render() {
        return <div id='observatory-app' className='container-fluid'>
            <div id='menu_bar'>
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
    }

    _changeVizType = (e) => {
        this.setState({vizType: e.target.id});
    };

    _typeChanged = (eventType) => {
        this.setState({eventType});
    };
}

export default HijacksDashboard;
