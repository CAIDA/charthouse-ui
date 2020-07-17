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
import classNames from 'classnames';
import ExpressionSet from "../expression/set";

const KEYPRESS_DAMPER_DELAY = 400; //ms. How long to wait for a typing gap before evaluating expression and propagate changes

class ExpressionTxtEditor extends React.Component {
    static propTypes = {
        expressionSet: PropTypes.instanceOf(ExpressionSet),
        onChange: PropTypes.func,
        onValidStateChange: PropTypes.func
    };

    static defaultProps = {
        expressionSet: new ExpressionSet(),
        onChange: function (newExpression) { },
        onValidStateChange: function (newState) { }
    };

    state = {
        expTxt: this.props.expressionSet.getCanonicalStr(true),
        isValid: !!this.props.expressionSet
    };

    componentDidUpdate(prevProps, prevState) {
        var curExp = this._createExpressionSet();
        if (!this.props.expressionSet.equals(prevProps.expressionSet)
            && (!curExp || !this.props.expressionSet.equals(curExp))) {
            this.setState({
                expTxt: this.props.expressionSet.getCanonicalStr(true),
                isValid: !!this.props.expressionSet
            });
        }

        if (prevState.isValid !== this.state.isValid) {
            this.props.onValidStateChange(this.state.isValid);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Performance boost
        return (nextState.isValid !== this.state.isValid)
            || (nextState.expTxt !== this.state.expTxt)
            || !nextProps.expressionSet.equals(this.props.expressionSet);
    }

    render() {
        return <div className="charthouse-expression-txt-editor">
            <samp
                className={classNames('form-group', {'has-error': !this.state.isValid})}>
                    <textarea
                        ref="expTxt"
                        className="form-control"
                        rows="8"
                        placeholder={'Write an expression...\ne.g.: scale(my.favorite.target, 10)'}
                        value={this.state.expTxt}
                        onChange={this._onExpTxtChange}
                        onKeyUp={this._onKeyUp}
                    />
            </samp>
        </div>
    }

    _onExpTxtChange = (e) => {
        this.setState({expTxt: e.target.value});
    };

    // Private methods
    _onKeyUp = (e) => {
        if ([16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) != -1) return; // Just navigation

        // Wait for user to pause typing
        if (this.keyPressDamper !== false)
            clearTimeout(this.keyPressDamper);

        this.keyPressDamper = setTimeout(
            this._evalExpression,
            KEYPRESS_DAMPER_DELAY
        );
    };

    _evalExpression = () => {
        const set = this._createExpressionSet();
        this.setState({isValid: !!set});
        if (set) {
            this.props.onChange(set);
        }
    };

    _createExpressionSet = () => {
        try {
            return ExpressionSet.createFromCanonicalStr(this.state.expTxt);
        } catch (err) {
            if (err instanceof TypeError) {
                return false;
            } else {
                throw err;
            }
        }
    };

    // Public methods
    isValid = () => {
        return this.state.isValid;
    };

    injectExpression = (exp) => {
        if (!this.state.isValid)
            return; // Can't append

        var newExp = this._createExpressionSet();
        if (newExp) {
            newExp.addExpression(exp);
            this.setState({expTxt: newExp.getCanonicalStr(true)});
            this._evalExpression();
        }
    };
}

export default ExpressionTxtEditor;
