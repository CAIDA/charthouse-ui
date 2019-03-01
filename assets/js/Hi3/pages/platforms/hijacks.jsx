import React from 'react';
import Iframe from 'react-iframe';

import StatsTable from 'Hijacks/components/stats-table';
import EventTypeSelector from 'Hijacks/components/event-type-selector';

import 'Hi3/css/pages/platforms/hijacks.css';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import ucsdLogo from 'images/logos/UCSanDiegoLogo-BlueGold.png';
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";

const HORIZONTAL_OFFSET = 480;

class Hijacks extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        eventType: 'moas',
        vizType: 'feed',
        frameWidth: window.innerWidth - HORIZONTAL_OFFSET
    };

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {
        const embedUrl = this.state.vizType === 'feed' ?
            `//bgp.caida.org/hi3/${this.state.eventType}`:
            `//ioda.caida.org/public/hijacks-trworthy-${this.state.eventType === 'all' ? 'overall' : this.state.eventType}`;

        const embedHeight = this.state.vizType === 'timeseries' ? '500px' : null;
        const embedWidth = `${this.state.frameWidth}px`;

        return <div id='hijacks' className='container-fluid'>
            <div className='row header'>
                <div className='col-md-6 page-header'>
                    <h1>BGP Hijacks Observatory</h1>
                    <p className='lead'>
                        The BGP Hijacks Observatory is a lorem ipsum dolor sit
                        amet,
                        consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
                <div className='col-lg-offset-1 col-lg-5 col-md-6 stats-header'>
                    <StatsTable eventType={this.state.eventType}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
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
                </div>
            </div>
            <div className='row' style={{margin: 0}}>
                <Iframe
                    url={embedUrl}
                    width={embedWidth}
                    height={embedHeight}
                />
            </div>
            <div className='acks pull-right text-center panel panel-default'>
                <div className='panel-body'>
                <h2>Data &amp; Analytics provided by</h2>
                <div className='text-center ack-logos'>
                    <a href='https://www.caida.org'>
                        <img src={caidaLogo} className='ack-logo'/>
                    </a>
                    <a href='https://www.ucsd.edu'>
                        <img src={ucsdLogo} className='ack-logo'/>
                    </a>
                </div>
                </div>
            </div>
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

export default Hijacks;
