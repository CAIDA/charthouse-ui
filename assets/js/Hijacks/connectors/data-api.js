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

import $ from 'jquery';

const API_URL = '//bgp.caida.org/json';
const EVENTS_QUERY = '/events';
const STATS_QUERY = '/stats';

class ApiConnector {

    constructor() {
        this.apiUrl = API_URL;
        this.timeout = 20 * 1000;
    };

    _getJson(httpMethod, url, params, headerParams, success, error) {
        headerParams = headerParams || {};

        error = error || function () { }; // Error function optional

        const xThis = this;
        return $.ajax({
            url: url,
            data: httpMethod === 'POST' ? JSON.stringify(params) : params,
            headers: headerParams,
            contentType: httpMethod === 'POST' ? 'application/json; charset=utf-8' : 'text/plain',
            type: httpMethod,
            dataType: 'json',
            xhrFields: {
                withCredentials: false
            },
            timeout: xThis.timeout
        })
            .done(function (json, textStatus, xOptions) {
                success({
                    jsonResponseSize: xOptions.responseText.length, // PropertyTag json size (bytes) in data
                    data: json
                });
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (textStatus === "abort") return;  // Call intentionally aborted
                const rJson = jqXHR.responseJSON;
                error((errorThrown ? errorThrown + ': ' : '') +
                    (rJson && rJson.error ? rJson.error : 'An unknown error occurred'));
            });
    }

    getEvents(type, params, success, error) {
        return this._getJson(
            'GET',
            this.apiUrl + EVENTS_QUERY + '/' + type,
            params,
            {},
            success,
            error
        );
    }

    getStats(type, success, error) {
        return this._getJson(
            'GET',
            this.apiUrl + STATS_QUERY + '/' + type,
            {},
            {},
            success,
            error
        );
    }
}

export default ApiConnector;
