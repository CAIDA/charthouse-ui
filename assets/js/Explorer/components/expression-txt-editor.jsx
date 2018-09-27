import React from 'react';
import classNames from 'classnames';

import Expression from '../utils/expression';

const ExpressionTxtEditor = React.createClass({

    const: {
        KEYPRESS_DAMPER_DELAY: 400 //ms. How long to wait for a typing gap before evaluating expression and propagate changes
    },

    propTypes: {
        expression: React.PropTypes.instanceOf(Expression),
        onChange: React.PropTypes.func,
        onValidStateChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            expression: new Expression(),
            onChange: function (newExpression) {
            },
            onValidStateChange: function (newState) {
            }
        };
    },

    getInitialState: function () {
        return {
            expTxt: this.props.expression.getCanonicalTxt(),
            isValid: !!this.props.expression
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        var curExp = this._getExpression();
        if (!this.props.expression.equals(prevProps.expression)
            && (!curExp || !this.props.expression.equals(curExp))) {
            this.setState({
                expTxt: this.props.expression.getCanonicalTxt(),
                isValid: !!this.props.expression
            });
        }

        if (prevState.isValid != this.state.isValid) {
            this.props.onValidStateChange(this.state.isValid);
        }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        // Performance boost
        return (nextState.isValid != this.state.isValid)
            || (nextState.expTxt != this.state.expTxt)
            || (!nextProps.expression.equals(this.props.expression));
    },

    mixins: [React.addons.LinkedStateMixin],

    render: function () {
        return <div className="charthouse-expression-txt-editor">
            <samp
                className={classNames('form-group', {'has-error': !this.state.isValid})}>
                    <textarea
                        ref="expTxt"
                        className="form-control"
                        rows="8"
                        placeholder={'Write an expression...\ne.g.: scale(my.favorite.target, 10)'}
                        valueLink={this.linkState('expTxt')}
                        onKeyUp={this._onKeyUp}
                    />
            </samp>
        </div>
    },

    // Private methods
    _onKeyUp: function (e) {
        if ([16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) != -1) return; // Just navigation

        // Wait for user to pause typing
        if (this.keyPressDamper !== false)
            clearTimeout(this.keyPressDamper);

        this.keyPressDamper = setTimeout(
            this._evalExpression,
            this.const.KEYPRESS_DAMPER_DELAY
        );
    },

    _evalExpression: function () {
        var exp = this._getExpression();

        this.setState({isValid: !!exp});
        if (exp) {
            this.props.onChange(exp);
        }
    },

    _getExpression: function () {
        var exp = new Expression();
        try {
            exp.setCanonicalTxt(this.state.expTxt);
            return exp;
        } catch (err) {
            return false;
        }
    },

    // Public methods
    isValid: function () {
        return this.state.isValid;
    },

    injectExpression: function (exp) {
        if (!this.state.isValid)
            return; // Can't append

        var newExp = this._getExpression();
        if (newExp) {
            newExp.appendExpression(exp);
            this.setState({expTxt: newExp.getCanonicalTxt()});
            this._evalExpression();
        }
    }
});

export default ExpressionTxtEditor;
