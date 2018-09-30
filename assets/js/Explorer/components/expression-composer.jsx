import React from 'react/addons';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.css';

import Expression from '../utils/expression';
import HeirarchyExplorer from './hierarchy-explorer';
import ExpressionBuilder from './expression-builder';
import ExpressionTxtEditor from './expression-txt-editor';
import Toggle from './toggle-switch';

const ExpressionComposer = React.createClass({

    const: {
        EXPRESSION_VERTICAL_OFFSET: 170,
        MIN_HEIGHT_TREE_EXPLORER: 250
    },

    propTypes: {
        expression: React.PropTypes.instanceOf(Expression),
        initExpandMetricTree: React.PropTypes.bool,
        maxHeight: React.PropTypes.number,
        onExpressionEntered: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            expression: new Expression(),
            initExpandMetricTree: true,
            maxHeight: 500,
            onExpressionEntered: function (newExp) {
            }
        };
    },

    getInitialState: function () {
        return {
            txtMode: false,
            isValid: true,
            autoApply: true,
            replaceMode: false,
            editExpression: this.props.expression
        }
    },

    componentDidMount: function () {
        this.setState({
            isValid: this.refs[this.state.txtMode ? 'txtEditor' : 'uiEditor'].isValid()
        });
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (!this.props.expression.equals(prevProps.expression)) {
            this.setState({editExpression: this.props.expression});
        }

        if (!this.state.editExpression.equals(prevState.editExpression)) {
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
    },

    mixins: [React.addons.LinkedStateMixin],

    render: function () {
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
                    expression={this.state.editExpression}
                    onChange={this._expChanged}
                    onValidStateChange={this._validityChanged}
                />
            </div>

            <div style={{display: this.state.txtMode ? false : 'none'}}>
                <ExpressionTxtEditor
                    ref="txtEditor"
                    expression={this.state.editExpression}
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
                               checkedLink={this.linkState('autoApply')}
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
                    this.const.MIN_HEIGHT_TREE_EXPLORER,
                    this.props.maxHeight - this.const.EXPRESSION_VERTICAL_OFFSET
                ),
                overflow: 'auto',
                paddingBottom: 10 // Space for horizontal scroll-bar
            }}>
                <HeirarchyExplorer
                    ref="metricExplorer"
                    onLeafSelected={this._metricSelected}
                    initExpandPath={this.props.initExpandMetricTree ? this.props.expression.getAllMetrics() : []}
                />
            </div>

        </div>;
    },

    // Private methods
    _switchEditMode: function () {
        if (this.state.txtMode && !this.refs.txtEditor.isValid()) {
            // Can't switch
            $(this.refs.editMode.getDOMNode()).flash(160, 2);
            return;
        }

        // Crossfade edit modes
        var rThis = this;
        var inComp = this.refs[this.state.txtMode ? 'uiEditor' : 'txtEditor'];
        var outComp = this.refs[!this.state.txtMode ? 'uiEditor' : 'txtEditor'];
        $(outComp.getDOMNode()).fadeOut(200, function () {
            rThis.setState({
                txtMode: !rThis.state.txtMode,
                isValid: inComp.isValid()
            });
            $(inComp.getDOMNode()).fadeIn(200);
        });

    },

    _expChanged: function (exp) {
        this.setState({editExpression: exp});
    },

    _validityChanged: function (newState) {
        this.setState({isValid: newState});
    },

    _applyExpression: function () {
        if (this.state.isValid)
            this.props.onExpressionEntered(this.state.editExpression);
    },

    _toggleReplaceMode: function (newState) {
        this.setState({replaceMode: newState});
    },

    _metricSelected: function (id) {
        var metricExp = new Expression({
            type: "path",
            path: id
        });

        if (this.state.replaceMode) {
            this.setState({editExpression: metricExp});
        } else {
            this.refs[this.state.txtMode ? 'txtEditor' : 'uiEditor'].injectExpression(metricExp);
        }
    }

});

export default ExpressionComposer;
