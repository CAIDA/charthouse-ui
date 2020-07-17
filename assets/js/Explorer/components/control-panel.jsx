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

import { auth } from 'Auth';
import CharthouseTime from '../utils/time';
import TimeRangeControl from './time-range-control';
import PluginSelector from './plugin-selector';
import ExpressionComposer from './expression-composer';
import ExpressionSet from "../expression/set";

// Module constants
const HIERARCHY_EXPLORER_VERTICAL_OFFSET = 330; // # vertical px already in use by headers, other controls, etc

class ControlPanel extends React.Component {
    static propTypes = {
        expressionSet: PropTypes.instanceOf(ExpressionSet).isRequired,
        from: PropTypes.instanceOf(CharthouseTime).isRequired,
        until: PropTypes.instanceOf(CharthouseTime).isRequired,
        plugin: PropTypes.string.isRequired,
        initExpandMetricTree: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        initExpandMetricTree: true,
        onChange: function (changedParams) {
        }
    };

    state = {
        windowHeight: window.innerHeight
    };

    componentDidMount() {
        window.addEventListener('resize', this._setWindowHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._setWindowHeight);
    }

    _setWindowHeight = () => {
        this.setState({windowHeight: window.innerHeight});
    };

    _timeSelected = (from, until) => {
        this.props.onChange({
            from: from,
            until: until
        });
    };

    _pluginSelected = (selPlugin) => {
        this.props.onChange({plugin: selPlugin});
    };

    _expressionEntered = (newExpSet) => {
        if (!newExpSet || !newExpSet.equals(this.props.expressionSet)) {
            this.props.onChange({expressionSet: newExpSet});
        }
    };

    render() {

        return <div>
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
                    Build query expression
                </div>
                <div className="panel-body">
                    <ExpressionComposer
                        expressionSet={this.props.expressionSet}
                        initExpandMetricTree={this.props.initExpandMetricTree}
                        maxHeight={Math.max(300, this.state.windowHeight - HIERARCHY_EXPLORER_VERTICAL_OFFSET)}
                        onExpressionEntered={this._expressionEntered}
                    />
                </div>
            </div>
        </div>
    }
}

export default ControlPanel;
