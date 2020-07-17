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

