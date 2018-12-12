import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import '../utils/jquery-plugins';
import DataApi from '../connectors/data-api';

return React.createClass({

    getInitialState: function () {
        return {
            shortUrl: '',
            customName: '',
            fetching: false,
            namingSucceeded: false,
            nameCollision: false,
            connectionError: null
        }
    },

    componentDidMount: function () {
        var rThis = this;

        // Fetch anonymous short URL
        this.setState({fetching: true});
        this._shortenUrl(
            this._getCurrentUrl(),
            function (shortUrl) {
                rThis.setState({
                    fetching: false,
                    shortUrl: shortUrl
                });
            },
            function () {    // API connection error
                rThis.setState({
                    fetching: false,
                    connectionError: 'Server connection timeout. Unable to generate short URL...'
                });
            }
        );
    },

    render: function () {
        return <div className="text-center">
            <div>
                Your short URL:&nbsp;
                <span className="well well-sm">
                        {/* Use input box instead of span so that it can be selected/highlighted */}
                    {/* Style it like a span. Width needs to be adjusted every time the val changes */}
                    <input type="text" className="lead" readOnly
                           ref="shortUrl"
                           style={{
                               width: $().textWidth(this.state.shortUrl, '23px arial'),
                               display: this.state.shortUrl ? false : 'none',
                               border: 'none',
                               backgroundColor: 'inherit',
                               padding: 0,
                               textAlign: 'center'
                           }}
                           value={this.state.shortUrl}
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
    },

    // Private methods
    _nameChange: function (e) {
        // Reset api call results
        this.setState({
            customName: e.target.value,
            namingSucceeded: false,
            nameCollision: false,
            connectionError: false
        });
    },

    _nameKeyPress: function (e) {
        if (e.keyCode == 13) {   // Submit on enter
            this._submitName();
        }
    },

    _submitName: function () {
        var rThis = this;

        if (!this.state.customName || this.state.namingSucceeded || this.state.nameCollision) return;

        this.setState({fetching: true});

        this._shortenUrl(
            this._getCurrentUrl(),
            function (shortUrl) {
                rThis.setState({
                    fetching: false,
                    namingSucceeded: true,
                    shortUrl: shortUrl
                });

                $(ReactDOM.findDOMNode(rThis.refs.shortUrl)).flash(400);
            },
            function () {    // API connection error
                rThis.setState({
                    fetching: false,
                    connectionError: 'Server connection timeout. Please try again...'
                });
            },
            rThis.state.customName,
            function () {    // Name is already in use
                rThis.setState({
                    fetching: false,
                    nameCollision: true
                });
            }
        );

    },

    _shortenUrl: function (longUrl, shortTag, callback, error, nameInUseCb) {
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
    },

    _getCurrentUrl: function () {
        return window.location.href;
    }

});
