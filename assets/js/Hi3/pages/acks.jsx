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

import {HI3} from 'Hi3/utils';

import dhsLogo from 'images/logos/dhs.svg';
import nsfLogo from 'images/logos/nsf.svg';
import nerscLogo from 'images/logos/nersc.png';
import xsedeLogo from 'images/logos/xsede-black.png';
import sdscLogo from 'images/logos/sdsc.svg';
import ucsdLogo from 'images/logos/UCSanDiegoLogo-BlueGold.png';


import 'Hi3/css/pages/acks.css';

class Acks extends React.Component {
    render() {
        return <div className='container'>
            <div className="page-header">
                <h1>Acknowledgements</h1>
            </div>
            <div className='ackgroup'>
                <h2>Major Support</h2>
                <div className='row'>
                    <div className='col-md-4 ackbox'>
                        <img src={dhsLogo}/>
                        <p>
                            {HI3} is funded by the US Department of Homeland
                            Security (DHS) Information Marketplace for Policy and
                            Analysis of Cyber-risk & Trust
                            (<a href="https://www.impactcybertrust.org/">IMPACT</a>)
                            project.
                        </p>
                    </div>
                </div>
            </div>
            <div className='ackgroup'>
                <h2>Additional Support</h2>
                <div className='row'>
                    <div className='col-md-4 ackbox'>
                        <img src={nsfLogo}/>
                        <p>
                            The {HI3} platform is based on infrastructure developed
                            under support from NSF grant CNS-1228994
                            [Detection and Analysis of Large-scale Internet
                            Infrastructure Outages (IODA)].
                        </p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4 ackbox'>
                        <img src={nerscLogo}/>
                        <p>
                            Storage resources are supported by NERSC, a DOE Office
                            of Science User Facility
                            supported by the Office of Science of the U.S.
                            Department of Energy under Contract No.
                            DE-AC02-05CH11231.
                        </p>
                    </div>
                    <div className='col-md-4 ackbox'>
                        <img src={xsedeLogo}/>
                        <p>
                            Computational resources are supported by National
                            Science Foundation grant number
                            ACI-1053575.
                        </p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4 ackbox'>
                        <img src={sdscLogo}/>
                    </div>
                    <div className='col-md-4 ackbox'>
                        <img src={ucsdLogo}/>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default Acks;
