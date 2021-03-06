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
import 'font-awesome/css/font-awesome.css';

import HeirarchyExplorer from './hierarchy-explorer';
import ExpressionBuilder from './expression-builder';
import ExpressionTxtEditor from './expression-txt-editor';
import Toggle from './toggle-switch';
import '../utils/jquery-plugins';
import ExpressionSet from "../expression/set";
import PathExpression from "../expression/path";

const EXPRESSION_VERTICAL_OFFSET = 170;
const MIN_HEIGHT_TREE_EXPLORER = 250;

class ExpressionComposer extends React.Component {
    static propTypes = {
        expressionSet: PropTypes.instanceOf(ExpressionSet),
        initExpandMetricTree: PropTypes.bool,
        maxHeight: PropTypes.number,
        onExpressionEntered: PropTypes.func
    };

    static defaultProps = {
        expressionSet: new ExpressionSet(),
        initExpandMetricTree: true,
        maxHeight: 500,
        onExpressionEntered: function (newExp) {}
    };

    state = {
        txtMode: false,
        isValid: true,
        autoApply: true,
        replaceMode: false,
        editExpressionSet: this.props.expressionSet
    };

    componentDidMount() {
        this.setState({
            isValid: this.refs[this.state.txtMode ? 'txtEditor' : 'uiEditor'].isValid()
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.props.expressionSet.equals(prevProps.expressionSet)) {
            this.setState({editExpressionSet: this.props.expressionSet});
        }

        if (!this.state.editExpressionSet.equals(prevState.editExpressionSet)) {
            this.setState({isValid: this.refs[this.state.txtMode ? 'txtEditor' : 'uiEditor'].isValid()});
            if (this.state.autoApply) {
                // Auto apply expression
                this._applyExpression();
            }
        }

        if (this.state.autoApply && !prevState.autoApply) {
            // Apply current expression (if possible) if auto toggled on
            this._applyExpression();
        }
    }

    render() {
        return <div>
            <p className="text-right small" style={{margin: 1}}>
                <a
                    ref="editMode"
                    href="javascript:void(0)"
                    className="small text-info"
                    onClick={this._switchEditMode}
                >
                    {this.state.txtMode ? 'Edit in UI' : 'Edit in plain text'}
                </a>
            </p>

            <div style={{display: this.state.txtMode ? 'none' : false}}>
                <ExpressionBuilder
                    ref="uiEditor"
                    expressionSet={this.state.editExpressionSet}
                    onChange={this._expChanged}
                    onValidStateChange={this._validityChanged}
                />
            </div>

            <div style={{display: this.state.txtMode ? false : 'none'}}>
                <ExpressionTxtEditor
                    ref="txtEditor"
                    expressionSet={this.state.editExpressionSet}
                    onChange={this._expChanged}
                    onValidStateChange={this._validityChanged}
                />
            </div>

            <div className="row" style={{margin: '3px 0 0'}}>
                <div className="pull-left">
                        <span style={{fontSize: '75%'}}>
                            <span className="fa fa-bolt"/> Replace mode:
                        </span>
                    <div className="pull-right" style={{margin: 4}}>
                        <Toggle
                            on={this.state.replaceMode}
                            description='Switch ON to override and replace expression content on metric selection (warning: erases current expression)'
                            onToggle={this._toggleReplaceMode}
                        />
                    </div>
                </div>

                <div className="pull-right">
                    <label
                        title="Enable auto-apply on any changes to the expression"
                        style={{
                            display: 'inline-block',
                            margin: '0 6px',
                            cursor: 'pointer'
                        }}
                    >
                        <span className="text-muted"
                              style={{fontSize: '.75em'}}>Auto </span>
                        <input type="checkbox"
                               checked={this.autoApply}
                               onChange={this._toggleAutoApply}
                        />
                    </label>
                    <button type="button"
                            className="btn btn-primary btn-sm"
                            style={{padding: '0 3px'}}
                            disabled={!this.state.isValid || this.state.autoApply}
                            onClick={this._applyExpression}
                    >
                        Apply <i className="fa fa-chevron-circle-right"/>
                    </button>
                </div>
            </div>

            <div style={{
                marginTop: 6,
                maxHeight: Math.max(
                    MIN_HEIGHT_TREE_EXPLORER,
                    this.props.maxHeight - EXPRESSION_VERTICAL_OFFSET
                ),
                overflow: 'auto',
                paddingBottom: 10 // Space for horizontal scroll-bar
            }}>
                <HeirarchyExplorer
                    ref="metricExplorer"
                    onLeafSelected={this._metricSelected}
                    initExpandPath={this.props.initExpandMetricTree ? this.props.expressionSet.getAllByType('path') : []}
                />
            </div>

        </div>;
    }

    // Private methods
    _switchEditMode = () => {
        if (this.state.txtMode && !this.refs.txtEditor.isValid()) {
            // Can't switch
            $(ReactDOM.findDOMNode(this.refs.editMode)).flash(160, 2);
            return;
        }

        // Crossfade edit modes
        var rThis = this;
        var inComp = this.refs[this.state.txtMode ? 'uiEditor' : 'txtEditor'];
        var outComp = this.refs[!this.state.txtMode ? 'uiEditor' : 'txtEditor'];
        $(ReactDOM.findDOMNode(outComp)).fadeOut(200, function () {
            rThis.setState({
                txtMode: !rThis.state.txtMode,
                isValid: inComp.isValid()
            });
            $(ReactDOM.findDOMNode(inComp)).fadeIn(200);
        });

    };

    _expChanged = (exp) => {
        this.setState({editExpressionSet: exp});
    };

    _validityChanged = (newState) => {
        this.setState({isValid: newState});
    };

    _applyExpression = () => {
        if (this.state.isValid)
            this.props.onExpressionEntered(this.state.editExpressionSet);
    };

    _toggleReplaceMode = (newState) => {
        this.setState({replaceMode: newState});
    };

    _toggleAutoApply = (newState) => {
        this.setState({autoApply: newState});
    };

    _metricSelected = (id) => {
        const metricExp = new PathExpression(id);
        if (this.state.replaceMode) {
            const newSet = new ExpressionSet();
            newSet.addExpression(metricExp)
            this.setState({editExpressionSet: newSet});
        } else {
            this.refs[this.state.txtMode ? 'txtEditor' : 'uiEditor'].injectExpression(metricExp);
        }
    };
}

export default ExpressionComposer;
