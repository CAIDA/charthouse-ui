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

import React from 'react';
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";

class RangePicker extends React.Component {

    constructor(props){
        super(props);
        this.ranges = {
            'Today': [
                moment().startOf('day').utc(true),
                moment.utc()
            ],
            '-4 hours': [
                moment.utc().subtract(4, 'hours'),
                moment.utc()
            ],
            '-24 hours': [
                moment.utc().subtract(1, 'days'),
                moment.utc()
            ],
            '-7 days': [
                moment.utc().subtract(7, 'days'),
                moment.utc()
            ],
            '-1 month': [
                moment.utc().subtract(1, 'months'),
                moment.utc()
            ],
            '-1 year': [
                moment.utc().subtract(1, 'years'),
                moment.utc()
            ]
        };
    }

    render() {
        let timeRangeStr = `${this.props.startDate.utc().format("lll")} - ${this.props.endDate.utc().format("lll")}`;
        return (
            <div className="search-bar__component">
                <label className="search-bar__label">
                    Select time period (UTC now: {moment().utc().format("lll")})
                </label>
                <span className="glyphicon glyphicon-calendar search-bar__time-icon"/>
                <DateRangePicker
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onApply={this.props.onApply}
                    ranges={this.ranges}
                    showDropdowns={true}
                    minYear={2000}
                    alwaysShowCalendars={true}
                    autoApply={true}
                    timePicker={true}
                    timePicker24Hour={true}
                    timePickerIncrement={5}
                >
                        <input
                            readOnly={true}
                            className="form-control search-bar__time-input"
                            value={timeRangeStr}
                        />
                </DateRangePicker>
            </div>
        );
    }
}

export default RangePicker;
