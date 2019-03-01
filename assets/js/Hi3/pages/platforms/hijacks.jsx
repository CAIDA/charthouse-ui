import React from 'react';
import Iframe from 'react-iframe';

import StatsTable from 'Hijacks/components/stats-table';
import EventTypeSelector from 'Hijacks/components/event-type-selector';

import 'Hi3/css/pages/platforms/hijacks.css';

import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import ucsdLogo from 'images/logos/UCSanDiegoLogo-BlueGold.png';

const HORIZONTAL_OFFSET = 480;

class Hijacks extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        eventType: 'moas',
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
                <div className='col-lg-offset-1 col-lg-5 col-md-6 stats-header'>
                    <StatsTable eventType={this.state.eventType}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <EventTypeSelector eventType={this.state.eventType}
                                       onChange={this._typeChanged}/>
                </div>
            </div>
            <Iframe
                url={`//bgp.caida.org/hi3/${this.state.eventType}`}
                width={`${this.state.frameWidth}px`}
            />
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

    _typeChanged = (eventType) => {
        this.setState({eventType});
    };
}

export default Hijacks;
