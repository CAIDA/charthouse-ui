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

import moment from 'moment';

// TODO: figure out how to fix the moment warning

var CharthouseTime = function (time) {

    this.isRelative = false;
    this.momentObj = null;

    // Syntax conversion of durations between graphite and moment objects
    var graphite2MomentDurations = {
        min: 'm',
        mon: 'M'
    };

    this.absTimeFormat = 'LL h:mma z';

    // Null input, use 'now'
    if (!time) {
        this.isRelative = true;
        this.momentObj = moment.duration();
    }

    if (typeof time == 'number') {
        // assume that it is a unix seconds timestamp
        this.momentObj = moment.unix(time).utc();
    }

    if (typeof time == 'string') {
        if (time.toLowerCase() === 'now') {
            // Now
            this.isRelative = true;
            this.momentObj = moment.duration();   // 0 duration
        } else if (time.charAt(0) == '-' || time.charAt(0) == '+') {
            // Relative time
            this.isRelative = true;
            var durStr = time.match(/[\-0-9]+|[a-zA-Z]+/g);
            this.momentObj = moment.duration(parseInt(durStr[0]), graphite2MomentDurations[durStr[1]] || durStr[1]);
        } else if (!isNaN(time)) {
            // Unix time
            this.momentObj = moment.unix(time).utc();
        } else {
            // Time string
            this.momentObj = moment(time).utc();
        }
        return;
    }

    if (typeof time == 'object') {
        if (time.hasOwnProperty('_milliseconds')) {
            // Moment duration object
            this.isRelative = true;
            this.momentObj = time;
        } else if (time._isAMomentObject) {
            // Absolute moment object
            this.momentObj = time;
        }
    }
};

CharthouseTime.prototype.getMomentObj = function () {
    return this.momentObj;
};

CharthouseTime.prototype.isRelative = function () {
    return this.isRelative;
};

CharthouseTime.setAbsTimeFormat = function (format) {
    this.absTimeFormat = format;
};

CharthouseTime.prototype.toAbs = function () {
    return (this.isRelative)
        ? moment().utc().add(this.momentObj)
        : this.momentObj;
};

CharthouseTime.prototype.toParamStr = function () {
    if (this.isRelative) {
        if (Math.abs(this.momentObj.asSeconds()) < 1) return 'now';
        if (isInt(this.momentObj.asYears())) return this.momentObj.asYears() + 'y';
        if (isInt(this.momentObj.asMonths())) return this.momentObj.asMonths() + 'mon';
        if (isInt(this.momentObj.asWeeks())) return this.momentObj.asWeeks() + 'w';
        if (isInt(this.momentObj.asDays())) return this.momentObj.asDays() + 'd';
        if (isInt(this.momentObj.asHours())) return this.momentObj.asHours() + 'h';
        if (isInt(this.momentObj.asMinutes())) return this.momentObj.asMinutes() + 'min';
        return this.momentObj.asSeconds() + 's';
    } else {
        return this.momentObj.unix();
    }

    function isInt(num) {
        return num === parseInt(num);
    }
};

CharthouseTime.prototype.toHuman = function () {
    return this.isRelative
        ? (this.momentObj.asSeconds() == 0 ? 'Now' : this.momentObj.humanize(true))
        : this.momentObj.format(this.absTimeFormat);
};

export default CharthouseTime;
