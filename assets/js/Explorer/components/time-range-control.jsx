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
import moment from 'moment';
import $ from 'jquery';

// TODO: find a new/updated picker so we don't have to use our custom version
import '../libs/daterangepicker.custom'
import 'Explorer/css/daterangepicker.custom.css';

import CharthouseTime from '../utils/time';

const MOMENT_DATE_FORMAT = 'LL h:mma z';

class TimeRangeControl extends React.Component {
    static propTypes = {
        from: PropTypes.instanceOf(CharthouseTime).isRequired,
        until: PropTypes.instanceOf(CharthouseTime).isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
        onChange: function (newFrom, newUntil) {
        }
    };

    componentDidMount() {

        var customLastUniqueId = "datePickerCustomId_" + Math.round(Math.random() * 1000000);
        var $customLastHtml = $('<div class="form-inline" id="' + customLastUniqueId + '">').append(
            'Last ',
            $('<input type="number" min="1" class="form-control input-sm" placeholder="number">')
                .css({
                    width: '35%',
                    height: '23px',
                    margin: '0px 1px',
                    padding: '2px',
                    'vertical-align': 'middle'
                }),
            $('<select class="form-control input-sm">').append(
                $('<option value="minute">').text('mins'),
                $('<option value="hour">').text('hours'),
                $('<option value="day" selected>').text('days'),
                $('<option value="week">').text('weeks'),
                $('<option value="month">').text('months'),
                $('<option value="year">').text('years')
            ).css({
                width: '45%',
                height: '23px',
                margin: '0px 1px',
                padding: '0px',
                'vertical-align': 'middle'
            })
        );

        var customLastFunc = function () {
            var $num = $('input', '#' + customLastUniqueId),
                $type = $('select', '#' + customLastUniqueId);
            return moment.duration(-$num.val(), $type.val());
        };

        var defaultRanges = {
            'Today': [moment().utc().startOf('day'), moment().utc().endOf('day')],
            //'-5 mins': [moment.duration(-5, 'm'), moment.duration()],
            '-60 mins': [moment.duration(-1, 'h'), moment.duration()],
            '-24 hours': [moment.duration(-1, 'd'), moment.duration()],
            '-7 days': [moment.duration(-7, 'd'), moment.duration()],
            '-1 month': [moment.duration(-1, 'M'), moment.duration()],
            '-1 year': [moment.duration(-1, 'y'), moment.duration()]
            //'Yesterday': [moment().utc().subtract(1, 'days').startOf('day'), moment().utc().startOf('day')],
        };

        //defaultRanges[moment().utc().format('MMMM')]=[moment().utc().startOf('month'), moment.duration()];
        defaultRanges[moment().utc().subtract(1, 'month').format('MMMM')] = [moment().utc().subtract(1, 'month').startOf('month'), moment().utc().startOf('month')];
        defaultRanges[moment().utc().format('YYYY') + ' '] = [moment().utc().startOf('year'), moment.duration()];
        defaultRanges[moment().utc().subtract(1, 'year').format('YYYY') + ' '] = [moment().utc().subtract(1, 'year').startOf('year'), moment().utc().startOf('year')];

        defaultRanges[$customLastHtml[0].outerHTML] = [customLastFunc, moment.duration()];

        var rThis = this;
        this.$dateRangePicker = $(ReactDOM.findDOMNode(this.refs.DateRangePicker))
            .daterangepicker({
                    startDate: this.props.from.getMomentObj(),
                    endDate: this.props.until.getMomentObj(),
                    ranges: defaultRanges,
                    timeZone: 0,    // Offset from UTC
                    timePicker: true,
                    timePicker12Hour: false,
                    timePickerIncrement: 5,
                    showDropdowns: true,
                    showWeekNumbers: true,
                    format: MOMENT_DATE_FORMAT,
                    applyClass: "btn-sm btn-primary",
                    cancelClass: "btn-sm btn-default"
                },
                function (start, end) {
                    var newFrom = new CharthouseTime(start);
                    var newUntil = new CharthouseTime(end);

                    // Don't issue change if time range didn't change
                    if (rThis.props.from.toParamStr() != newFrom.toParamStr()
                        || rThis.props.until.toParamStr() != newUntil.toParamStr()) {
                        rThis.props.onChange(newFrom, newUntil);
                    }
                }
            );

        // Prevent submitting when clicking on controls
        $('input, select', '#' + customLastUniqueId).click(function (e) {
            e.stopPropagation();
        });

        // Submit on enter key
        $('input, select', '#' + customLastUniqueId).keypress(function (e) {
            if (e.which == 13) {
                $('#' + customLastUniqueId).click();
            }
        });

        $('input, select', '#' + customLastUniqueId).bind("change keyup", function () {
            rThis.$dateRangePicker.data('daterangepicker').setStartDate(customLastFunc());
            rThis.$dateRangePicker.data('daterangepicker').setEndDate(moment.duration());
        });
    }

    componentDidUpdate() {
        // Update date range picker
        var curStart = new CharthouseTime(this.$dateRangePicker.data('daterangepicker').startDate);
        if (curStart.toParamStr() !== this.props.from.toParamStr())
            this.$dateRangePicker.data('daterangepicker').setStartDate(this.props.from.getMomentObj());

        var curEnd = new CharthouseTime(this.$dateRangePicker.data('daterangepicker').endDate);
        if (curEnd.toParamStr() !== this.props.until.toParamStr())
            this.$dateRangePicker.data('daterangepicker').setEndDate(this.props.until.getMomentObj());
    }

    componentWillUnmount() {
        // Destroy plugin
        var $elem = $(ReactDOM.findDOMNode(this.refs.DateRangePicker));
        $.removeData($elem.get(0));
    }

    _clickCalendarIcon = (e) => {
        // Open UI on icon click
        e.stopPropagation();
        this.$dateRangePicker.data('daterangepicker').toggle();
    };

    render() {

        return <div className="input-group input-group-sm">
                <span className="input-group-addon btn">
                    <i className="glyphicon glyphicon-calendar"
                       onClick={this._clickCalendarIcon}
                    />
                </span>
            <input type="text" className="form-control" ref="DateRangePicker"
                   defaultValue={this.props.from.toHuman() + ' - ' + this.props.until.toHuman()}
            />
        </div>;
    }
}

export default TimeRangeControl;
