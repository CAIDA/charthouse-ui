import React from 'react';
import config from '../config/config';
import CharthouseTime from '../utils/time';
import DataApi from '../connectors/data-api';
import VizPlugin from './plugin-loader';
import ExpressionSet from "../expression/set";

const Visualizer = React.createClass({

    const: {
        PLACEHOLDER_TXT: '' //'Here be beautiful things...'
    },

    propTypes: {
        expressionSet: React.PropTypes.instanceOf(ExpressionSet).isRequired,
        from: React.PropTypes.instanceOf(CharthouseTime).isRequired,
        until: React.PropTypes.instanceOf(CharthouseTime).isRequired,
        plugin: React.PropTypes.string.isRequired,
        title: React.PropTypes.string,
        header: React.PropTypes.node,
        configMan: React.PropTypes.object,
        hidePanel: React.PropTypes.bool,
        loadingTxt: React.PropTypes.node,

        markersDataCall: React.PropTypes.func,
        markersDataCallParams: React.PropTypes.object,
        postProcessMarkersData: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            configMan: config,   // Use global config if no namespace is specified
            markersDataCall: null,
            markersDataCallParams: {},
            postProcessMarkersData: function (data) {
                return data;
            }
        }
    },

    getInitialState: function () {
        return {
            apiConnector: new DataApi()
        }
    },

    componentDidUpdate: function (prevProps) {
        var cur = this.props;
        if (this.refs.vizPlugin &&
            (!cur.expressionSet.equals(prevProps.expressionSet)
                || cur.from.toParamStr() !== prevProps.from.toParamStr()
                || cur.until.toParamStr() !== prevProps.until.toParamStr()
            )
        ) {
            this.refs.vizPlugin.refresh();
        }
    },

    render: function () {
        var exprStr = this.props.expressionSet.toSerialJson();

        return <div>
            {(!exprStr || !exprStr.length || !this.props.from || !this.props.until || !this.props.plugin)
                ? <p className="lead">{this.const.PLACEHOLDER_TXT}</p>
                : <VizPlugin
                    ref="vizPlugin"
                    plugin={this.props.plugin}
                    title={this.props.title}
                    header={this.props.header}
                    queryTxt={this.props.expressionSet.getCanonicalStr(true)}
                    loadingTxt={this.props.loadingTxt}
                    dataCall={this._dataCall}
                    markersDataCall={this.props.markersDataCall
                        ? this._markersDataCallWrapper
                        : undefined}
                    configMan={this.props.configMan}
                    hidePanel={this.props.hidePanel}
                />
            }
        </div>;
    },

    // Private methods
    _dataCall: function (success, error) {
        return this.state.apiConnector.getTsData(
            {
                expression: this.props.expressionSet.toJsonArray(),
                from: this.props.from.toParamStr(),
                until: this.props.until.toParamStr(),
                downSampleFunc: this.props.configMan.getParam('downSampleFunc')
            },
            success,
            error
        );
    },

    _markersDataCallWrapper: function (success, error) {
        return this.props.markersDataCall(
            this.props.markersDataCallParams,
            function (data) {
                success(this.props.postProcessMarkersData(data));
            }.bind(this),
            error
        );
    }
});

export default Visualizer;
