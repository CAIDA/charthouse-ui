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

import d3 from 'd3';
import $ from 'jquery';
import _ from 'underscore';

var extractSeriesMeta = function (seriesNames) {

    // If just one series
    if (seriesNames.length == 1) return {
        commonPrefix: seriesNames[0],
        commonSuffix: null,
        seriesNames: _.object([seriesNames[0]], [null])
    };

    var cols = _.map(
        _.zip.apply( // Turn into a matrix of cols = node names
            _,
            _.map(seriesNames, function (s) {
                return s.split('.');
            })
        ),
        function (col) { // Keep only # of unique fields
            return _.uniq(col).length;
        }
    );

    var prefixNodes, suffixNodes;

    _.find(cols, function (c, i) {
        prefixNodes = i;
        return (c > 1);
    });

    _.find(cols.reverse(), function (c, i) {
        suffixNodes = i;
        return (c > 1);
    });

    if (suffixNodes == cols.length) {
        suffixNodes = 0;
    } // Only 1 series

    var seriesConv = _.object(seriesNames, _.map(seriesNames, function (s) {
        return s.split('.').slice(prefixNodes, -suffixNodes || Infinity).join('.') || null;
    }));

    return {
        seriesNames: seriesConv,
        commonPrefix: seriesNames[0].split('.').slice(0, prefixNodes).join('.') || null,
        commonSuffix: seriesNames[0].split('.').slice(-suffixNodes || Infinity).join('.') || null
    };
};

var halfSINumFormatter = function (precisionDigits) {
    return function (num) {
        return d3.format(
            (isNaN(precisionDigits) ? '' : '.' + precisionDigits)
            + ((Math.abs(num) < 1) ? 'r' : 's')
        )(num);
    }
};

var objDiff = function (obj1, obj2) {
    var newObj = $.extend({}, obj1, obj2);
    var result = {};
    $.each(newObj, function (key, value) {
        if (!obj2.hasOwnProperty(key) || !obj1.hasOwnProperty(key) || obj2[key] !== obj1[key]) {
            result[key] = [obj1[key], obj2[key]];
        }
    });
    return result;
};

var setEquals = function (arr1, arr2) {
    arr1 = (arr1 instanceof Array) ? arr1 : [arr1];
    arr2 = (arr2 instanceof Array) ? arr2 : [arr2];

    if (arr1.some(function (el1) {
        return arr2.indexOf(el1) == -1;
    })) {
        return false;   // At least one elem of arr1 not in arr2
    }

    return !(arr2.some(function (el2) {
        return arr1.indexOf(el2) == -1;
    }));                // At least one elem of arr2 not in arr1
};

// Runs a task periodically, sleeping "interval" time in between runs
// task: function(callback) , the callback function should be ran whenever finishing the task
function periodicTask(interval, task) {

    var currentTimeout = null;
    var running = false;

    return {
        isRunning: function () {
            return running;
        },
        run: function () {
            running = true;
            (function _doItAgain() {
                task(function () {
                    if (running) {
                        currentTimeout = setTimeout(_doItAgain, interval);
                    }
                });
            })(); // Run it at once first time
        },
        stop: function () {
            running = false;
            clearTimeout(currentTimeout);
        }
    };
}

// extract a boolean from what could be null, a boolean, or a string:
//  - null -> false
//  - false -> false
//  - true -> true
//  - 'false' -> false
//  - [others] -> true
function fuzzyBoolean(val) {
    return !(val === undefined || val === null || val === false || val === "false");
}

export default {
    extractSeriesMeta: extractSeriesMeta,
    halfSINumFormatter: halfSINumFormatter,
    objDiff: objDiff,
    setEquals: setEquals,
    periodicTask: periodicTask,
    fuzzyBoolean: fuzzyBoolean
};
