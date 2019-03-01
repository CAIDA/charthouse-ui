import React from 'react';
import Iframe from 'react-iframe';
import {ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

import StatsTable from 'Hijacks/components/stats-table';

import 'Hi3/css/pages/platforms/hijacks.css';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import ucsdLogo from 'images/logos/UCSanDiegoLogo-BlueGold.png';

const HORIZONTAL_OFFSET = 460;

class Hijacks extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        eventType: 'all',
        frameWidth: window.innerWidth - HORIZONTAL_OFFSET
    };

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {
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
                <div className='col-md-offset-2 col-md-4 stats-header text-right'>
                    <StatsTable eventType={this.state.eventType}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <label className='type-label'>
                        Select an event type
                    </label>
                    {/* onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734 */}
                    <ToggleButtonGroup type="radio" name="eventType"
                                       value={this.state.eventType}
                                       onChange={this._changeEventType}
                    >
                        <ToggleButton value='all' id='all'
                                      onClick={this._changeEventType}>All</ToggleButton>
                        <ToggleButton value='moas' id='moas'
                                      onClick={this._changeEventType}>MOAS</ToggleButton>
                        <ToggleButton value='submoas' id='submoas'
                                      onClick={this._changeEventType}>Sub-MOAS</ToggleButton>
                        <ToggleButton value='edges' id='edges'
                                      onClick={this._changeEventType}>New Edge</ToggleButton>
                        <ToggleButton value='defcon' id='defcon'
                                      onClick={this._changeEventType}>Defcon</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <div className='row'>
                <Iframe
                    url={`//bgp.caida.org/hi3/${this.state.eventType}`}
                    width={`${this.state.frameWidth}px`}
                />
            </div>
            <div className='acks pull-right text-center'>
                <h2>Data &amp; Analytics provided by</h2>
                <div className='text-center ack-logos'>
                    <img src={caidaLogo} className='ack-logo'/>
                    <img src={ucsdLogo} className='ack-logo'/>
                </div>
            </div>
        </div>;
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };

    _changeEventType = (e) => {
        this.setState({eventType: e.target.id});
    };
}

export default Hijacks;
