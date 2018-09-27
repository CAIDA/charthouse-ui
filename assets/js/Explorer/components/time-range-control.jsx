import React from 'react';
import moment from 'moment';
import $ from 'jquery';
//import '../../../libs/daterangepicker/js/daterangepicker.custom';
import 'bootstrap-daterangepicker';

import CharthouseTime from '../utils/time';

const TimeRangeControl = React.createClass({

    const: {
        MOMENT_DATE_FORMAT: 'LL h:mma z'
    },

    propTypes: {
        from: React.PropTypes.instanceOf(CharthouseTime).isRequired,
        until: React.PropTypes.instanceOf(CharthouseTime).isRequired,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            onChange: function (newFrom, newUntil) {
            }
        };
    },

    componentDidMount: function () {

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
        this.$dateRangePicker = $(this.refs.DateRangePicker.getDOMNode())
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
                    format: this.const.MOMENT_DATE_FORMAT,
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
    },

    componentDidUpdate: function () {
        // Update date range picker
        var curStart = new CharthouseTime(this.$dateRangePicker.data('daterangepicker').startDate);
        if (curStart.toParamStr() !== this.props.from.toParamStr())
            this.$dateRangePicker.data('daterangepicker').setStartDate(this.props.from.getMomentObj());

        var curEnd = new CharthouseTime(this.$dateRangePicker.data('daterangepicker').endDate);
        if (curEnd.toParamStr() !== this.props.until.toParamStr())
            this.$dateRangePicker.data('daterangepicker').setEndDate(this.props.until.getMomentObj());
    },

    componentWillUnmount: function () {
        // Destroy plugin
        var $elem = $(this.refs.DateRangePicker.getDOMNode());
        $.removeData($elem.get(0));
    },

    _clickCalendarIcon: function (e) {
        // Open UI on icon click
        e.stopPropagation();
        this.$dateRangePicker.data('daterangepicker').toggle();
    },

    render: function () {

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

});

export default TimeRangeControl;
