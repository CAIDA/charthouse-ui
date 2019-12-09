import React from "react";
import caidaLogo from 'images/logos/caida-logo-cropped.svg';
import ucsdLogo from 'images/logos/UCSanDiegoLogo-BlueGold.png';


class DataProvider extends React.Component {
    render(){
        return <div className='acks pull-right text-center panel panel-default'>
            <div className='panel-body'>
            <h2>Data &amp; Analytics provided by</h2>
            <div className='text-center ack-logos'>
                <div className='row'>
                    <a href='https://www.caida.org/funding/hijacks'
                       target='_blank'>
                        CAIDA's BGP Hijacks Project <span style={{fontSize: '.8em'}} className='glyphicon glyphicon-share'/>
                    </a>
                </div>
                <div className='row'>
                    <a href='https://www.caida.org'
                       target='_blank'>
                        <img src={caidaLogo} className='ack-logo' alt="CAIDA Logo"/>
                    </a>
                </div>
                <div className='row'>
                    <a href='https://www.ucsd.edu'
                       target='_blank'>
                        <img src={ucsdLogo} className='ack-logo'alt="UCSD Logo"/>
                    </a>
                </div>
            </div>
        </div>
        </div>
    }
}

export default DataProvider

