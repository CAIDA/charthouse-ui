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
import { Redirect } from 'react-router-dom';

import { auth } from 'Auth';
import hi3Logo from 'images/logos/hicube-full.png';

class PendingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        relogin: false
    };

    render() {
        if (this.state.relogin) {
            return <Redirect to='/login'/>;
        }
        return <div className='container'>
            <div className="jumbotron">
                <h1>
                    <img id="hi3-logo" src={hi3Logo}/>
                    <p><span style={{fontSize: '100px'}}
                             className='glyphicon glyphicon-bullhorn'/></p>
                </h1>
            </div>
            <div className='row text-center'>
                <p className='lead'>
                    Hello, {auth.getName()}.
                    <br/>
                    You have successfully signed into Hi³, but your
                    account has not yet been approved by an administrator.
                    <br/>
                    If you think you are seeing this page in error, please
                    contact <a href='mailto:hicube-info@caida.org'>
                    hicube-info.caida.org</a>.
                </p>
                <p className='lead'>
                    If you think your account has been approved recently,
                    you can <a href="javascript:void(0);" onClick={this._relogin}>log in</a> again.
                </p>
            </div>
        </div>;
    }


    _relogin = () => {
        auth.logout();
        this.setState({relogin: true});
    };

}

export default PendingPage;
