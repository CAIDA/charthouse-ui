import React from 'react';
import Iframe from 'react-iframe';

import 'Hi3/css/pages/platforms/hijacks.css';

const HORIZONTAL_OFFSET = 460;

class Hijacks extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
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
            <div className='page-header'>
                <h1>BGP Hijacks Observatory</h1>
            </div>
            <div className='content'>
                <div className='acks pull-right text-right'>
                    <h3>Acknowledgements</h3>
                </div>
                <div>
                    <Iframe
                        url='//bgp.caida.org/hi3/moas'
                        width={`${this.state.frameWidth}px`}
                    />
                </div>
            </div>
        </div>;
    }

    _resize = () => {
        const newWidth = window.innerWidth - HORIZONTAL_OFFSET;
        this.setState({frameWidth: newWidth});
    };
}

export default Hijacks;
