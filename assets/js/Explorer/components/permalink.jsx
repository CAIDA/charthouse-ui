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
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';

import '../utils/jquery-plugins';
import DataApi from '../connectors/data-api';
import config from 'Config';

class PermalinkForm extends React.Component {
    state = {
        shortUrl: '',
        customName: '',
        fetching: false,
        namingSucceeded: false,
        nameCollision: false,
        connectionError: null
    };

    componentDidMount() {
        const rThis = this;

        // Fetch anonymous short URL
        this.setState({fetching: true});
        this._shortenUrl(
            this._getCurrentUrl(),
            null, // generate a short tag for us
            function (shortUrl) {
                rThis.setState({
                    fetching: false,
                    shortUrl
                });
            },
            function () {    // API connection error
                rThis.setState({
                    fetching: false,
                    connectionError: 'Server connection timeout. Unable to generate short URL...'
                });
            }
        );
    }

    render() {
        const absUrl = this.state.shortUrl ? config.getParam('baseUri') + '/@' + this.state.shortUrl : null;

        return <div className="text-center">
            <div>
                Your short URL:&nbsp;
                <span className="well well-sm">
                        {/* Use input box instead of span so that it can be selected/highlighted */}
                    {/* Style it like a span. Width needs to be adjusted every time the val changes */}
                    <input type="text" className="lead" readOnly
                           ref="shortUrl"
                           style={{
                               width: $().textWidth(absUrl, '23px arial'),
                               display: absUrl ? false : 'none',
                               border: 'none',
                               backgroundColor: 'inherit',
                               padding: 0,
                               textAlign: 'center'
                           }}
                           value={absUrl}
                           onFocus={function (e) {
                               // Select text on focus
                               e.target.select();
                           }}
                           onMouseUp={function (e) {
                               // Preventing undoing the text selection above
                               e.preventDefault();
                           }}

                    />
                    </span>
                <i className="fa fa-spinner fa-spin fa-lg"
                   style={{
                       marginLeft: 5,
                       display: this.state.fetching ? false : 'none'
                   }}
                   title="Shortening URL..."
                />
            </div>
            <hr/>
            <div className="form-inline">
                <div className={classNames(
                    'input-group', 'input-group-sm',
                    {
                        'has-success': this.state.namingSucceeded,
                        'has-error': this.state.nameCollision
                    }
                )}>
                    <span
                        className="input-group-addon">{'Want to name it?'}</span>
                    <input type="text" className="form-control"
                           value={this.state.customName}
                           placeholder="enter your preferred short url name"
                           style={{width: 250}}
                           onChange={this._nameChange}
                           onKeyDown={this._nameKeyPress}
                    />
                </div>
                <button className="btn btn-primary btn-sm"
                        disabled={!this.state.customName || this.state.namingSucceeded || this.state.nameCollision}
                        style={{
                            marginLeft: 10,
                            padding: 5
                        }}
                        onClick={this._submitName}
                >Rename
                </button>
            </div>
            <span className={classNames(
                'help-block', 'small',
                {
                    'text-success': this.state.namingSucceeded,
                    'text-danger': (this.state.nameCollision || this.state.connectionError)
                }
            )}>
                    {this.state.namingSucceeded ? 'URL successfully renamed!' : null}
                {this.state.nameCollision ? 'Name already in use, please pick a different one...' : null}
                {this.state.connectionError || null}
                </span>
        </div>
    }

    // Private methods
    _nameChange = (e) => {
        // Reset api call results
        this.setState({
            customName: e.target.value,
            namingSucceeded: false,
            nameCollision: false,
            connectionError: false
        });
    };

    _nameKeyPress = (e) => {
        if (e.keyCode === 13) {   // Submit on enter
            this._submitName();
        }
    };

    _submitName = () => {
        const rThis = this;

        if (!this.state.customName || this.state.namingSucceeded || this.state.nameCollision) return;

        this.setState({fetching: true});

        this._shortenUrl(
            this._getCurrentUrl(),
            rThis.state.customName,
            function (shortUrl) {
                rThis.setState({
                    fetching: false,
                    namingSucceeded: true,
                    shortUrl
                });

                $(ReactDOM.findDOMNode(rThis.refs.shortUrl)).flash(400);
            },
            function () {    // API connection error
                rThis.setState({
                    fetching: false,
                    connectionError: 'Server connection timeout. Please try again...'
                });
            },
            function () {    // Name is already in use
                rThis.setState({
                    fetching: false,
                    nameCollision: true
                });
            }
        );

    };

    _shortenUrl = (longUrl, shortTag, callback, error, nameInUseCb) => {
        const conn = new DataApi();
        conn.createShortUrl(
            function (data) {
                if (shortTag && shortTag !== data.data.short_tag) {
                    nameInUseCb();
                    return;
                }
                callback(data.data.short_tag);
            },
            error,
            longUrl,
            shortTag || null
        );
    };

    _getCurrentUrl = () => {
        return window.location.href;
    };
}

export default PermalinkForm;
