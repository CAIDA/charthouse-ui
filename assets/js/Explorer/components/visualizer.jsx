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
import config from 'Config';
import CharthouseTime from '../utils/time';
import DataApi from '../connectors/data-api';
import VizPlugin from './plugin-loader';
import ExpressionSet from "../expression/set";

class Visualizer extends React.Component {
    static propTypes = {
        expressionSet: PropTypes.instanceOf(ExpressionSet).isRequired,
        from: PropTypes.instanceOf(CharthouseTime).isRequired,
        until: PropTypes.instanceOf(CharthouseTime).isRequired,
        plugin: PropTypes.string.isRequired,
        title: PropTypes.string,
        header: PropTypes.node,
        configMan: PropTypes.object,
        hidePanel: PropTypes.bool,
        loadingTxt: PropTypes.node,

        markersDataCall: PropTypes.func,
        markersDataCallParams: PropTypes.object,
        postProcessMarkersData: PropTypes.func
    };

    static defaultProps = {
        configMan: config,   // Use global config if no namespace is specified
        markersDataCall: null,
        markersDataCallParams: {},
        postProcessMarkersData: function (data) {
            return data;
        }
    };

    state = {
        apiConnector: new DataApi()
    };

    componentDidUpdate(prevProps) {
        var cur = this.props;
        if (this.refs.vizPlugin &&
            (!cur.expressionSet.equals(prevProps.expressionSet)
                || cur.from.toParamStr() !== prevProps.from.toParamStr()
                || cur.until.toParamStr() !== prevProps.until.toParamStr()
            )
        ) {
            this.refs.vizPlugin.refresh();
        }
    }

    render() {
        const expCnt = this.props.expressionSet.getSize();
        return <div>
            {(expCnt === 0 || !this.props.from || !this.props.until || !this.props.plugin)
                ? null
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
    }

    // Private methods
    _dataCall = (success, error) => {
        return this.state.apiConnector.getTsData(
            {
                expressions: this.props.expressionSet.toJsonArray(),
                from: this.props.from.toParamStr(),
                until: this.props.until.toParamStr(),
                downSampleFunc: this.props.configMan.getParam('downSampleFunc')
            },
            success,
            error
        );
    };

    _markersDataCallWrapper = (success, error) => {
        return this.props.markersDataCall(
            this.props.markersDataCallParams,
            function (data) {
                success(this.props.postProcessMarkersData(data));
            }.bind(this),
            error
        );
    };
}

export default Visualizer;
