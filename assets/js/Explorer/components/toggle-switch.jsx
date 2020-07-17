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
import 'jquery-toggles';
import 'jquery-toggles/css/toggles.css';
import 'jquery-toggles/css/themes/toggles-modern.css';

class ToggleSwitch extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        on: PropTypes.bool,
        textOn: PropTypes.string,
        textOff: PropTypes.string,
        description: PropTypes.string,
        onToggle: PropTypes.func
    };

    static defaultProps = {
        width: 43,
        height: 16,
        on: false,
        textOn: 'On',
        textOff: 'Off',
        description: '',
        onToggle: function (isOn) {
        }
    };

    componentDidMount() {
        this.$toggle = $(ReactDOM.findDOMNode(this.refs.toggleBtn)).toggles({
            width: this.props.width,
            height: this.props.height,
            on: this.props.on,
            drag: false,
            text: {
                on: this.props.textOn,
                off: this.props.textOff
            }
        });

        var rThis = this;
        this.$toggle.on('toggle', function (e, active) {
            rThis.props.onToggle(active);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.on != prevProps.on)
            this.$toggle.toggles(this.props.on);
    }

    componentWillUnmount() {
        // Destroy plugin
        var $elem = $(ReactDOM.findDOMNode(this.refs.toggleBtn));
        $.removeData($elem.get(0));
    }

    render() {
        return <div
            className="toggle-modern text-center"
            ref="toggleBtn"
            title={this.props.description}
            style={{WebkitFontSmoothing: 'antialiased'}}
        />
    }
}

export default ToggleSwitch;
