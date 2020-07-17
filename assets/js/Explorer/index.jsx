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

import config from 'Config';
import staticCfg from 'Config/static';
import CharthouseTime from './utils/time';
import ControlPanel from './components/control-panel';
import Visualizer from './components/visualizer';
import ExpressionSet from "./expression/set";

// TODO: break these styles up and move them to the actual components that use them
import 'Explorer/css/explorer.css';
import 'Explorer/css/viz-plugins.css';

class Explorer extends React.Component {
    constructor(props) {
        super(props);
        const expressionSet = ExpressionSet.createFromJsonArray(config.getParam('expressions'));

        this.state = {
            expressionSet: expressionSet,
            from: new CharthouseTime(config.getParam("from") || staticCfg.from),
            until: new CharthouseTime(config.getParam("until") || staticCfg.until),
            plugin: config.getParam("plugin") || staticCfg.plugin,
            showController: config.getParam('hideControl') == null,

            // used to be that we only expanded for non-default expression
            initExpandMetricTree: true
        };
    }

    componentDidMount() {
        // Monitor params change
        config.onParamChange(this._configChangeHandler);
    }

    componentWillUnmount() {
        config.unsubscribe(this._configChangeHandler);
    }

    _configChangeHandler = (newParams) => {
        var updQueryState = {};

        if (newParams.hasOwnProperty('expressions')) {
            updQueryState.expressionSet = ExpressionSet.createFromJsonArray(newParams.expressions);
        }

        if (newParams.hasOwnProperty('from')) {
            updQueryState.from = new CharthouseTime(newParams.from || staticCfg.from);
        }

        if (newParams.hasOwnProperty('until')) {
            updQueryState.until = new CharthouseTime(newParams.until || staticCfg.until);
        }

        if (newParams.hasOwnProperty('plugin')) {
            updQueryState.plugin = newParams.plugin || staticCfg.plugin;
        }

        if (newParams.hasOwnProperty('hideControl')) {
            updQueryState.showController = (newParams.hideControl == null);
        }

        if (Object.keys(updQueryState).length) {
            // Set new query params in one go
            this.setState(updQueryState);
        }
    };

    _changeQueryParams = (changedQueryParams) => {

        // Component state change managed by config manager
        var pushState = {};

        if (changedQueryParams.expressionSet)
            pushState.expressions = changedQueryParams.expressionSet.toSerialJson();

        if (changedQueryParams.from)
            pushState.from = changedQueryParams.from.toParamStr();

        if (changedQueryParams.until)
            pushState.until = changedQueryParams.until.toParamStr();

        if (changedQueryParams.plugin)
            pushState.plugin = changedQueryParams.plugin;

        config.setParams(pushState);
    };

    render() {
        return <div id="explorer-main">
            <div className="container-fluid">
                <div
                    className={this.state.showController ? 'col col-sm-4 col-lg-3' : ''}
                    style={this.state.showController ? {} : {display: 'none'}}
                >
                    <ControlPanel
                        expressionSet={this.state.expressionSet}
                        from={this.state.from}
                        until={this.state.until}
                        plugin={this.state.plugin}
                        onChange={this._changeQueryParams}
                        initExpandMetricTree={this.state.initExpandMetricTree}
                    />
                </div>
                <div
                    className={this.state.showController ? 'col col-sm-8 col-lg-9' : ''}
                >
                    <Visualizer
                        expressionSet={this.state.expressionSet}
                        from={this.state.from}
                        until={this.state.until}
                        plugin={this.state.plugin}
                    />
                </div>
            </div>
        </div>
    }
}

export default Explorer
