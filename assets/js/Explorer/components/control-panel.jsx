import React from 'react';

import config from '../config/config';
import Expression from '../utils/expression';
import CharthouseTime from '../utils/time';
import TimeRangeControl from './time-range-control';
import PluginSelector from './plugin-selector';
import ExpressionComposer from './expression-composer';

import hicubeLogo from '../../../images/logos/hicube-full.png';
import caidaLogo from '../../../images/logos/caida_logo_small.png';

const ControlPanel = React.createClass({

    const: {
        // Module Constants
        HIERARCHY_EXPLORER_VERTICAL_OFFSET: 430 // # vertical px already in use by headers, other controls, etc
    },

    propTypes: {
        expression: React.PropTypes.instanceOf(Expression).isRequired,
        from: React.PropTypes.instanceOf(CharthouseTime).isRequired,
        until: React.PropTypes.instanceOf(CharthouseTime).isRequired,
        plugin: React.PropTypes.string.isRequired,
        initExpandMetricTree: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            initExpandMetricTree: true,
            onChange: function (changedParams) {
            }
        };
    },

    getInitialState: function () {
        return {
            windowHeight: window.innerHeight
        };
    },

    componentDidMount: function () {
        window.addEventListener('resize', this._setWindowHeight);
    },

    componentWillUnmount: function () {
        window.removeEventListener('resize', this._setWindowHeight);
    },

    _setWindowHeight: function () {
        this.setState({windowHeight: window.innerHeight});
    },

    _timeSelected: function (from, until) {
        this.props.onChange({
            from: from,
            until: until
        });
    },

    _pluginSelected: function (selPlugin) {
        this.props.onChange({plugin: selPlugin});
    },

    _expressionEntered: function (newExp) {
        if (!newExp || !newExp.equals(this.props.expression)) {
            this.props.onChange({expression: newExp});
        }
    },

    render: function () {

        return <div>
            <div className="panel panel-default controller-panel">
                <div className="panel-heading text-center">
                    <img
                        src={hicubeLogo}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "80px"
                        }}
                    />
                </div>
                <div className="panel-body">
                        <span>
                            Logged in as <a
                            href={config.getParam('userProfileRoute')}><i>{config.getParam('username')}</i></a>
                        </span>
                    <a className="btn btn-default btn-xs pull-right"
                       title="Log out" href={config.getParam('logoutRoute')}
                    >
                        <span className="glyphicon glyphicon-log-out"/>
                        &nbsp;&nbsp;Log out
                    </a>
                </div>
            </div>
            <div className="panel panel-default controller-panel">
                <div className="panel-heading panel-title">
                    Pick a time period
                </div>
                <div className="panel-body">
                    <TimeRangeControl
                        from={this.props.from}
                        until={this.props.until}
                        onChange={this._timeSelected}
                    />
                </div>
            </div>
            <div className="panel panel-default controller-panel">
                <div className="panel-heading panel-title">
                    Select a visualization
                </div>
                <div className="panel-body">
                    <PluginSelector
                        selectedPlugin={this.props.plugin}
                        onPluginSelected={this._pluginSelected}
                    />
                </div>
            </div>
            <div className="panel panel-default controller-panel">
                <div className="panel-heading panel-title">
                    Specify metrics expression
                </div>
                <div className="panel-body">
                    <ExpressionComposer
                        expression={this.props.expression}
                        initExpandMetricTree={this.props.initExpandMetricTree}
                        maxHeight={Math.max(300, this.state.windowHeight - this.const.HIERARCHY_EXPLORER_VERTICAL_OFFSET)}
                        onExpressionEntered={this._expressionEntered}
                    />
                </div>
            </div>
            <div className="panel panel-default controller-panel"
                 style={{
                     backgroundColor: "#EEEEEE"
                 }}>
                <div className="panel-body">
                    <div style={{
                        float: "left"
                    }}>
                        <a href="https://www.caida.org">
                            <img
                                src={caidaLogo}
                                style={{
                                    width: "75px"
                                }}
                            />
                        </a>
                    </div>
                    <div style={{
                        marginLeft: "90px",
                        height: "100%"
                    }}>
                        <p className="text-muted"
                           style={{
                               margin: 0
                           }}
                        >
                            Hi³ is developed by <a
                            href="https://www.caida.org"
                            style={{
                                color: "#949da4"
                            }}
                        >CAIDA</a> and funded by the US Department of
                            Homeland Security (DHS) Information Marketplace
                            for Policy and Analysis of Cyber-risk & Trust
                            (<a
                            href="https://www.impactcybertrust.org/"
                            style={{
                                color: "#949da4"
                            }}
                        >IMPACT</a>)
                            project.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    }
});

export default ControlPanel;
