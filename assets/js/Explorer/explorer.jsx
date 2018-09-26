import React from 'react';

import config from './config/config';
import StaticCfg from './config/static';
import CharthouseTime from './utils/time';
import Expression from './utils/expression';

const Explorer = React.createClass({

    const: {
        // Module Constants
        DEFAULT_EXPRESSION: null,
        DEFAULT_QUERYTIME: [
            new CharthouseTime('-1d'),
            new CharthouseTime()    // Now
        ],
        DEFAULT_PLUGIN: 'xyGraph'
    },

    getInitialState: function () {
        var expression = new Expression();
        try {
            expression.setSerialJson(config.getParam('expression') || this.const.DEFAULT_EXPRESSION);
        } catch (e) {
            expression.setJson(null);
        }

        return {
            expression: expression,
            from: config.getParam("from")
                ? new CharthouseTime(config.getParam("from"))
                : this.const.DEFAULT_QUERYTIME[0],
            until: config.getParam("until")
                ? new CharthouseTime(config.getParam("until"))
                : this.const.DEFAULT_QUERYTIME[1],
            plugin: config.getParam("plugin") || this.const.DEFAULT_PLUGIN,
            showController: config.getParam('hideControl') == null,

            // Only expand if expression is not the default (statically) configured
            initExpandMetricTree: expression.getSerialJson() != StaticCfg.expression
        };
    },

    componentDidMount: function () {
        // Monitor params change
        config.onParamChange(this._configChangeHandler);
    },

    componentWillUnmount: function () {
        config.unsubscribe(this._configChangeHandler);
    },

    _configChangeHandler: function (newParams) {
        var updQueryState = {};

        if (newParams.hasOwnProperty('expression')) {
            updQueryState.expression = new Expression();
            updQueryState.expression.setSerialJson(
                newParams.expression != null ? newParams.expression : this.const.DEFAULT_EXPRESSION
            );
        }

        if (newParams.hasOwnProperty('from')) {
            updQueryState.from = newParams.from
                ? new CharthouseTime(newParams.from)
                : this.const.DEFAULT_QUERYTIME[0];
        }

        if (newParams.hasOwnProperty('until')) {
            updQueryState.until = newParams.until
                ? new CharthouseTime(newParams.until)
                : this.const.DEFAULT_QUERYTIME[1];
        }

        if (newParams.hasOwnProperty('plugin')) {
            updQueryState.plugin = newParams.plugin || this.const.DEFAULT_PLUGIN;
        }

        if (newParams.hasOwnProperty('hideControl')) {
            updQueryState.showController = (newParams.hideControl == null);
        }

        if (Object.keys(updQueryState).length) {
            // Set new query params in one go
            this.setState(updQueryState);
        }
    },

    _changeQueryParams: function (changedQueryParams) {

        // Component state change managed by config manager
        var pushState = {};

        if (changedQueryParams.expression)
            pushState.expression = changedQueryParams.expression.getSerialJson();

        if (changedQueryParams.from)
            pushState.from = changedQueryParams.from.toParamStr();

        if (changedQueryParams.until)
            pushState.until = changedQueryParams.until.toParamStr();

        if (changedQueryParams.plugin)
            pushState.plugin = changedQueryParams.plugin;

        config.setParams(pushState);
    },

    render: function () {
        return <div className="container-fluid">
            /*
            <div
                className={this.state.showController ? 'col col-sm-4 col-lg-3' : ''}
                style={this.state.showController ? {} : {display: 'none'}}
            >
                <ControlPanel
                    expression={this.state.expression}
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
                    expression={this.state.expression}
                    from={this.state.from}
                    until={this.state.until}
                    plugin={this.state.plugin}
                />
            </div>
            */
        </div>
    }
});

export default Explorer
