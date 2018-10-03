import React from 'react';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.css';

import Toggle from './toggle-switch';
import Dialog from './dialog';
import TimeLogger from './time-logger';
// TODO: PermalinkForm
import CharthouseDataSet from '../utils/dataset';
import CHARTHOUSE_PLUGIN_SPECS from '../config/plugin-specs';
import tools from '../utils/tools';
import '../utils/jquery-plugins';

// TODO: this component could probably be refactored into multiple modules

const PluginContent = React.createClass({

    propTypes: {
        data: React.PropTypes.instanceOf(CharthouseDataSet.api).isRequired,
        markers: React.PropTypes.object,
        onTimeChange: React.PropTypes.func,
        configMan: React.PropTypes.object,
        pluginCfg: React.PropTypes.object.isRequired,
        maxHeight: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            maxHeight: null
        }
    },

    getInitialState: function () {
        return {
            ReactPlugin: null  // AMD loaded
        }
    },

    componentDidMount: function () {
        this._loadPluginModule();
    },

    componentWillUnmount: function () {
        this.isUnmounted = true;
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.props.pluginCfg.jsFile != nextProps.pluginCfg.jsFile) {
            // Unload module
            this.setState({ReactPlugin: null});
        }
    },

    componentDidUpdate: function (prevProps) {
        if (this.props.pluginCfg.jsFile != prevProps.pluginCfg.jsFile) {
            this._loadPluginModule();
        }
    },

    render: function () {
        return <div className="viz-plugin-content"
                    style={{maxHeight: this.props.maxHeight || false}}>
            {this.state.ReactPlugin
                ? <this.state.ReactPlugin
                    data={this.props.data}
                    markers={this.props.markers}
                    configMan={this.props.configMan}
                    maxHeight={this.props.maxHeight || false}
                    onTimeChange={this.props.onTimeChange}
                />
                : null
            }
        </div>;
    },

    // Private methods
    _loadPluginModule: function () {
        const rThis = this;
        this.props.pluginCfg.import.then(function({default: Plugin}) {
            if (!rThis.isUnmounted) {
                rThis.setState({ReactPlugin: Plugin});
            }
        });
    }
});

const DataInfo = React.createClass({

    propTypes: {
        data: React.PropTypes.instanceOf(CharthouseDataSet.api).isRequired,
        vizTimeRange: React.PropTypes.array
    },

    getInitialState: function () {
        return {
            numPoints: this.props.data.cntNonNullPnts()
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        var newNumPoints = this.props.data.cntNonNullPnts();
        if (newNumPoints != this.state.numPoints) {
            this.setState({numPoints: newNumPoints});
        }

        // Blink on data changes
        if (this.props.data.numSeries != prevProps.data.numSeries) {
            $(this.refs.numSeries.getDOMNode()).flash(500, 2);
        }

        if (this.state.numPoints != prevState.numPoints) {
            $(this.refs.numPoints.getDOMNode()).flash(500, 2);
        }
    },

    render: function () {
        var dataRes = this.props.data.getResolution(
            function (dur) {
                return '<em>' + dur.humanize().replace(/^an? /, "") + '</em>';
            }
        ).map(function (stepAgg) {
            return stepAgg[0] + (stepAgg[1].length ? (' (in ' + stepAgg[1].join(', ') + ' bins)') : '');
        }).join(', ');
        dataRes = dataRes || 'n/a';

        return <div className="viz-plugin-info small">
                <span className="text-muted">
                    {'#'} Series: <em className="small"
                                      ref="numSeries">{this.props.data.numSeries}</em>
                    &nbsp;| {'#'} Points: <em className="small"
                                              ref="numPoints">{this.state.numPoints}</em>
                    &nbsp;| Data resolution: <span
                    dangerouslySetInnerHTML={{__html: dataRes}}/>
                </span>
            <span style={{float: 'right'}}>
                    {this.props.children}
                </span>
            {this.props.vizTimeRange && this.props.vizTimeRange.length == 2 &&
            <div className="pull-right"
                 style={{
                     marginRight: '10px'
                 }}
            >
                <TimeLogger
                    start={this.props.vizTimeRange[0]}
                    end={this.props.vizTimeRange[1]}
                />
            </div>}
        </div>;
    }
});

const PluginFooter = React.createClass({

    propTypes: {
        data: React.PropTypes.instanceOf(CharthouseDataSet.api).isRequired
    },

    getInitialState: function () {
        return {
            fillRawData: false,   // Has the 'show data' container been populated yet
            showingRawData: false
        }
    },

    componentDidUpdate: function (prevProps) {
        var data = this.props.data, prevData = prevProps.data;

        // Blink on data changes
        if (data.jsonSize() != prevData.jsonSize()) {
            $(this.refs.jsonSize.getDOMNode()).flash(500, 2);
        }
    },

    render: function () {
        return <div>
            <button type="button" className="btn btn-info btn-xs"
                    title="Show data used in this visualization"
                    onClick={this._toggleShowData}
            >
                <span className="glyphicon glyphicon-align-left"/>
                &nbsp;&nbsp;
                {('View JSON')}
            </button>

            <span style={{margin: '0px 10px'}}>
                    {this.props.children}
                </span>

            <button type="button" className="btn btn-info btn-xs pull-right"
                    title="Get Charthouse Permalink for current view"
                    onClick={this._getPermalink}
            >
                <span className="glyphicon glyphicon-link"/> Short URL
            </button>

            {/* TODO: Generate a cURL link since our queries are POST-only now */}
            <a target='_blank' className="pull-right btn btn-info btn-xs"
               href="#"
               title="Download json data file"
            >
                <span className="glyphicon glyphicon-save"/> json <small>
                (<span ref="jsonSize">{this.props.data.jsonSizeHuman()}</span>)
            </small>
            </a>
        </div>;
    },

    // Private methods
    _toggleShowData: function () {
        if (!this.state.fillRawData) {  // Fill on demand
            this.setState({fillRawData: true});
        }

        var $anchor = $('<span>');
        var rModal = React.render(
            <Dialog
                title="Raw JSON Data"
                onClose={function () {
                    // GC rogue modal
                    React.unmountComponentAtNode($anchor[0]);
                }}
            >
                <PluginContent
                    data={this.props.data}
                    pluginCfg={CHARTHOUSE_PLUGIN_SPECS.rawText}
                />
            </Dialog>,
            $anchor[0]
        );
        this.setState({showingRawData: !this.state.showingRawData});
    },

    _getPermalink: function () {

        var $anchor = $('<span>');
        React.render(
            <Dialog

                ns={this.props.ns}
                title="Get Charthouse Permalink"
                onClose={function () {
                    // GC rogue modal
                    React.unmountComponentAtNode($anchor[0]);
                }}
            >
                <PermalinkForm/>
            </Dialog>,
            $anchor.get(0)
        );
    }
});

const AutoPoller = React.createClass({

    propTypes: {
        on: React.PropTypes.bool,
        frequency: React.PropTypes.number,
        description: React.PropTypes.string,
        showToggle: React.PropTypes.bool,
        targets: React.PropTypes.arrayOf(React.PropTypes.shape({
            dataCall: React.PropTypes.func.isRequired,
            onNewData: React.PropTypes.func
        }).isRequired).isRequired,
        onToggle: React.PropTypes.func,
    },

    getDefaultProps: function () {
        return {
            on: false,
            frequency: 10000,   // ms
            description: '',
            showToggle: true,
            onToggle: function () {
            }
        };
    },

    getInitialState: function () {
        return {
            fetching: false,
            delivering: false,
            errors: []
        };
    },

    componentWillMount: function () {
        this.pollers = [];
    },

    componentDidMount: function () {

        var rThis = this;

        // Setup the pollers
        var numFetching = 0;
        var numDelivering = 0;

        this.pollers = this.props.targets.map(function (target) {
            var thisPoller = {
                xhr: null,
                timer: tools.periodicTask(
                    rThis.props.frequency,
                    function (cb) {
                        numFetching++;
                        rThis.setState({
                            fetching: true,
                            errors: []
                        });

                        if (thisPoller.xhr) {
                            thisPoller.xhr.abort();
                            thisPoller.xhr = null;
                        }

                        thisPoller.xhr = target.dataCall(
                            function success(newData) {
                                if (!rThis.pollers) {
                                    // we have been cancelled
                                    return;
                                }

                                numDelivering++;
                                rThis.setState({
                                    fetching: --numFetching > 0,
                                    delivering: true
                                });

                                target.onNewData(newData);

                                if (!rThis.pollers) {
                                    // we have been cancelled
                                    return;
                                }

                                rThis.setState({delivering: --numDelivering > 0});
                                thisPoller.xhr = null;
                                cb(); // All done, run callback
                            },
                            function error(msg) {
                                var errors = rThis.state.errors;
                                errors.push(msg);
                                rThis.setState({
                                    errors: errors
                                });
                                thisPoller.xhr = null;
                                cb();   // Try again
                            }
                        );
                    }
                )
            };
            return thisPoller;
        });

        // Run it immediately if initialized on
        if (this.props.on) {
            this.pollers.forEach(function (poller) {
                poller.timer.run();
            });
        }
    },

    componentDidUpdate: function (prevProps) {
        // Start/stop auto-polling
        if (this.props.on != prevProps.on) {
            var funcName = this.props.on ? 'run' : 'stop';
            this.pollers.forEach(function (poller) {
                if (poller.xhr) {
                    poller.xhr.abort();
                    poller.xhr = null;
                }
                poller.timer[funcName]();
            });
        }
    },

    componentWillUnmount: function () {
        // Stop auto-polling if running
        this.pollers.forEach(function (poller) {
            if (poller.xhr) {
                poller.xhr.abort();
                poller.xhr = null;
            }
            poller.timer.stop();
            poller.timer = null;
        });
        this.pollers = null;
    },

    render: function () {
        return <span>
                <span style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 5,
                    fontSize: '.8em'
                }}>
                {this.props.showToggle && <Toggle
                    on={this.props.on}
                    description={'Enable periodic polling to refresh data (every ' + Math.round(this.props.frequency / 1000) + 's)'}
                    onToggle={this.props.onToggle}
                />
                }
                </span>
                <span style={{fontSize: '.8em'}}>
                    <i className="fa fa-refresh fa-spin fa-fw"
                       style={{
                           display: this.state.fetching ? false : 'none'
                       }}
                       title="Fetching data..."
                    />
                    <i className="fa fa-paint-brush fa-spin fa-fw"
                       style={{
                           display: this.state.delivering ? false : 'none'
                       }}
                       title="Rendering new data..."
                    />
                    <i className="fa fa-exclamation-triangle fa-fw"
                       style={{
                           color: 'darkred',
                           display: this.state.errors.length ? false : 'none'
                       }}
                       title={'Failed to fetch new data (' + this.state.errors.join('; ') + ')'}
                    />
                </span>
            </span>
    }
});

//// Main plugin-loader component

const VizPlugin = React.createClass({

    const: {
        VERTICAL_OUTER_OFFSET: 25,   // # vertical px already taken outside component (for auto height sizing related to window height)
        HEADER_HEIGHT: 60,            // # vertical px used by panel header
        FOOTER_HEIGHT: 60,            // # vertical px used by panel footer
        MONITOR_UPD_FREQ: 20000 // ms
    },

    propTypes: {
        plugin: React.PropTypes.string,
        title: React.PropTypes.string,
        header: React.PropTypes.node,
        queryTxt: React.PropTypes.string,
        dataCall: React.PropTypes.func,
        markersDataCall: React.PropTypes.func,
        configMan: React.PropTypes.object,
        hidePanel: React.PropTypes.bool,
        loadingTxt: React.PropTypes.node
    },

    getDefaultProps: function () {
        return {
            plugin: 'rawText',
            title: '',
            queryTxt: '',
            dataCall: blankDataCall,
            markersDataCall: blankDataCall,
            hidePanel: false
        };

        function blankDataCall(successCb, errorCb) {
            successCb({/* data */});
            // Return pointer to ajax xhr object to allow on-demand aborting
            return new XMLHttpRequest();
        }
    },

    getInitialState: function () {

        var showControls = this.props.configMan.getParam('showControls', true);
        var showTimeLogger = this.props.configMan.getParam('showTimeLogger', true);
        var monitorCfg = this.props.configMan.getParam('liveUpdate', false);

        return {
            maxHeight: this.props.configMan.getParam('pluginMaxHeight') || (window.innerHeight - this.const.VERTICAL_OUTER_OFFSET),
            dataLoaded: false,
            parsing: false,
            monitoring: tools.fuzzyBoolean(monitorCfg),
            showControls: tools.fuzzyBoolean(showControls),
            showTimeLogger: tools.fuzzyBoolean(showTimeLogger),
            data: null,
            dataRetrievalError: null,
            vizTimeRange: null
        }
    },

    componentDidUpdate: function (prevProps) {
        if (this.props.plugin != prevProps.plugin && this.state.dataLoaded) {
            this.setState({
                vizTimeRange: [
                    this.state.data.summary().earliest_from * 1000,
                    this.state.data.summary().last_until * 1000
                ]
            });
        }
    },

    componentWillMount: function () {
        this.currentXhrs = [];
    },

    componentDidMount: function () {

        var rThis = this;

        this._abortAllXhrs();  // Abort current ajax request

        // Get initial data
        var dataLoading = 2;

        var currentXhr = this.props.dataCall(
            function (apiData) {    // Success

                rThis.setState({parsing: true});

                var chData = new CharthouseDataSet.api(apiData);

                rThis.setState({
                    dataLoaded: --dataLoading <= 0,
                    parsing: false,
                    data: chData,
                    vizTimeRange: [
                        chData.summary().earliest_from * 1000,
                        chData.summary().last_until * 1000
                    ]
                });

                // Set page title to series name (but only if our config is
                // the global config)
                // this check reads a little strangely because .globalCfg
                // returns the global config iff it is not the global
                // config...
                // TODO: figure out if there is a better way to do this
                if (!rThis.props.configMan.globalCfg) {
                    const dataTitle = chData.summary().common_prefix.getCanonicalHuman() || (rThis.props.title.length < 40 ? rThis.props.title.trim() : '');
                    document.title = [dataTitle, 'Hi³']
                        .filter(function (s) {
                            return s.length;
                        })
                        .join(' · ');
                }
            },

            function (msg) { // Data retrieval error
                rThis.setState({dataRetrievalError: msg});
            }
        );

        var markersXhr = this.props.markersDataCall(
            function success(apiData) {
                rThis.setState({dataLoaded: --dataLoading <= 0});
                rThis._onMarkersUpdate(apiData);
            },
            function error(msg) {
                rThis.setState({dataRetrievalError: msg});
            }
        );

        this.currentXhrs = [currentXhr, markersXhr];

        window.addEventListener('resize', this._setMaxHeight);
        this.props.configMan.onParamChange(this._setMaxHeight, 'pluginMaxHeight');
        this.props.configMan.onParamChange(this._setMonitoring, 'liveUpdate');
    },

    componentWillUnmount: function () {
        window.removeEventListener('resize', this._setMaxHeight);
        this.props.configMan.unsubscribe(this._setMaxHeight, 'pluginMaxHeight');
        this.props.configMan.unsubscribe(this._setMonitoring, 'liveUpdate');
        this._abortAllXhrs();
    },

    render: function () {

        var pluginObj = CHARTHOUSE_PLUGIN_SPECS[this.props.plugin];

        if (!pluginObj) {
            // No such plugin
            return <div className="alert alert-warning">
                Visualization plugin <strong>{this.props.plugin} </strong>
                not available! Please pick a different representation method.
            </div>;
        }

        var panelTitle = this.props.title
            ? this.props.title.trim()
            : (this.state.dataLoaded
                    ? this.state.data.summary().common_prefix.getCanonicalHuman()
                    : (this.props.queryTxt || null)
            );

        var liveUpdPoller = pluginObj.dynamic  // Include self-update button, if plugin supports it
            ? <AutoPoller
                on={this.state.monitoring}
                frequency={this.const.MONITOR_UPD_FREQ}
                showToggle={this.state.showControls}
                onToggle={this._selfUpdateToggle}
                targets={[{
                    dataCall: this.props.dataCall,
                    onNewData: this._onDataUpdate
                }, {
                    dataCall: this.props.markersDataCall,
                    onNewData: this._onMarkersUpdate
                }]}
            />
            : null;

        var panelBody = <div>
            <div className={this.props.hidePanel ? "" : "panel-body"}>
                {this.state.dataRetrievalError
                    // Data error
                    ? <div className="alert alert-danger">
                        <strong>Data retrieval
                            error: {this.state.dataRetrievalError}</strong>
                    </div>
                    : ((!this.state.dataLoaded || this.state.parsing)
                            // Loading data...
                            ? <div>
                                <div
                                    className="progress progress-striped active center-block">
                                    <div className="progress-bar"
                                         style={{width: '100%'}}>
                                        <span
                                            className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                <div className="text-muted text-center">
                                    {!this.state.parsing
                                        ? this.props.loadingTxt ? this.props.loadingTxt : ('Loading data' + (this.props.queryTxt.trim() ? (' for ' + this.props.queryTxt.trim().abbrFit(200)) : '...'))
                                        : 'Parsing data...'
                                    }
                                </div>
                            </div>
                            : (this.state.data.isEmpty()
                                    // Empty data
                                    ? <div className="text-center">
                                        <em>No data
                                            found</em> {!this.state.showControls && this.state.dataLoaded ? liveUpdPoller : null}
                                    </div>
                                    // Showing data
                                    : <div>
                                        <div>
                                            <PluginContent
                                                pluginCfg={pluginObj}
                                                data={this.state.data}
                                                markers={this.state.markers}
                                                onTimeChange={this._vizTimeChanged}
                                                configMan={this.props.configMan}
                                                maxHeight={this.state.maxHeight
                                                - this.const.HEADER_HEIGHT
                                                - (this.state.showControls ? this.const.FOOTER_HEIGHT : 0)
                                                }
                                            />
                                        </div>
                                        <DataInfo
                                            data={this.state.data}
                                            vizTimeRange={this.state.showTimeLogger ? this.state.vizTimeRange : null}
                                        >
                                            {   // Include poller here if it's not on footer
                                                !this.state.showControls && this.state.dataLoaded ? liveUpdPoller : null
                                            }
                                        </DataInfo>
                                    </div>
                            )
                    )
                }
            </div>

            {this.state.showControls && this.state.dataLoaded
                ? <div className="panel-footer">
                    <PluginFooter data={this.state.data}>
                            <span>
                                <em className="small"
                                    style={{marginRight: 5}}>Live-update:</em>
                                {liveUpdPoller}
                            </span>
                    </PluginFooter>
                </div>
                : null
            }
        </div>;

        return this.props.hidePanel
            ? panelBody
            : <div
                className="panel panel-default controller-panel charthouse-viz-plugin">
                <div className="panel-heading"
                     style={{display: this.state.dataLoaded ? false : 'none'}}
                >
                    {this.props.header
                        ? this.props.header
                        :
                        (<div className="text-center">
                            <strong
                                className="panel-title">{panelTitle || '\u00a0'}
                            </strong>
                        </div>)
                    }
                </div>
                {panelBody}
            </div>;
    },

    // Private methods
    _setMaxHeight: function () {
        var newHeight = this.props.configMan.getParam('pluginMaxHeight') || (window.innerHeight - this.const.VERTICAL_OUTER_OFFSET);
        if (this.state.maxHeight != newHeight) {
            this.setState({maxHeight: newHeight});
        }
    },

    _setMonitoring: function (newVal) {
        newVal = tools.fuzzyBoolean(newVal);
        if (newVal != this.state.monitoring) {
            this.setState({monitoring: newVal});
        }
    },

    _selfUpdateToggle: function (isOn) {
        this.props.configMan.setParams({liveUpdate: isOn});
    },

    _onDataUpdate: function (newData) {
        var newDataSet = new CharthouseDataSet.api(newData);
        if (this.state.data.diffData(newDataSet)) {
            // Update state if data has changed
            this.setState({
                data: newDataSet,
                vizTimeRange: [
                    newDataSet.summary().earliest_from * 1000,
                    newDataSet.summary().last_until * 1000
                ]
            });
        }
    },

    _vizTimeChanged: function (newTimeRange) {
        this.setState({vizTimeRange: newTimeRange})
    },

    _abortAllXhrs: function () {
        this.currentXhrs.forEach(function (xhr) {
            xhr.abort();
        });
        this.currentXhrs = [];
    },

    _onMarkersUpdate: function (apiData) {
        // markers = {
        //     seriesExpressionText: [{
        //         time: ...,
        //         value: ...,
        //         color: ...,
        //         iconUrl: ...
        //     }]
        // }
        this.setState({markers: apiData});
        //this.props.configMan.setParams({markers: apiData}, false);
    },

    // Public methods
    refresh: function () {
        // Reset to initial state and re-run constructor
        this.setState({
            dataLoaded: false,
            parsing: false,
            data: null,
            vizTimeRange: null,
            dataRetrievalError: null
        });
        this.componentDidMount();
    }

});

export default VizPlugin;
