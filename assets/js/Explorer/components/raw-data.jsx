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

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {SplitButton, MenuItem} from 'react-bootstrap';

import {CharthouseDataSet} from '../utils/dataset';
import CHARTHOUSE_PLUGIN_SPECS from '../viz-plugins/plugin-specs';
import PluginContent from './plugin-content';
import Dialog from './dialog';

class RawData extends React.Component {

    static propTypes = {
        data: PropTypes.instanceOf(CharthouseDataSet).isRequired
    };

    render() {
        return <SplitButton
            bsStyle='info'
            bsSize='xsmall'
            title={<div>
                <span className="glyphicon glyphicon-align-left"/>
                &nbsp;&nbsp;View JSON
            </div>}
            onClick={this._toggleShowData}
            id='raw-json'
        >
            <MenuItem
                eventKey="download"
                href={this._downloadData()}
                download='hi3-data.json'
            >Download JSON ({this.props.data.jsonSizeHuman()})</MenuItem>
            <MenuItem
                eventKey="curl"
                onClick={this._toggleShowCurl}
            >
                Get cURL command
            </MenuItem>
        </SplitButton>
    }

    _toggleShowData = () => {
        const $anchor = $('<span>');
        ReactDOM.render(
            <Dialog
                title="Raw JSON Data"
                onClose={function () {
                    // GC rogue modal
                    ReactDOM.unmountComponentAtNode($anchor[0]);
                }}
            >
                <PluginContent
                    data={this.props.data}
                    pluginCfg={CHARTHOUSE_PLUGIN_SPECS.rawText}
                />
            </Dialog>,
            $anchor[0]
        );
    };

    _toggleShowCurl = () => {
        const $anchor = $('<span>');
        ReactDOM.render(
            <Dialog
                title='Download JSON using cURL'
                onClose={function () {
                    // GC rogue modal
                    ReactDOM.unmountComponentAtNode($anchor[0]);
                }}
            >
                <p>
                    Copy and paste the following command into a terminal to
                    manually download the JSON data used in this visualization.
                    This can be useful as a starting point for accessing Hi³
                    data from scripts.
                </p>
                <p className='text-danger'>
                    This command contains an authentication token which belongs
                    to you only. <b>Do not share this command.</b>
                </p>
                <pre style={{maxHeight: window.innerHeight * .8}}>
                    <code>{this.props.data.getRequestAsCurl()}</code>
                </pre>
            </Dialog>,
            $anchor[0]
        );
    };

    _downloadData = () => {
        // this dumps all the data into the DOM, might be better to render the
        // download link only when the user wants it
        // TODO: only render data URL when user needs it
        return 'data:application/json;charset=utf-8,' +
            encodeURIComponent(this.props.data.dataAsJSON());
    };

}

export default RawData;
