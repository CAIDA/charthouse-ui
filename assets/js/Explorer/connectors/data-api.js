import $ from 'jquery';

import config from '../config/config';

var CharthouseApiConnector = function () {

    var apiCfg = config.getParam('api');

    this.apiUrl = apiCfg.url;
    this.timeout = (apiCfg.timeout || 20) * 1000;

    this.METRICS_QUERY_LIST = '/ts/list/';
    this.FUNCTIONS_QUERY = '/expression/functions/';
    this.DATA_QUERY = '/ts/query/';
};

CharthouseApiConnector.prototype._getJson = function (httpMethod, url, params, headerParams, success, error) {
    headerParams = headerParams || {};

    error = error || function () {}; // Error function optional

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
        if (json.hasOwnProperty('error') && json.error) {
            // shouldn't happen. errors should return HTTP error codes
            error(json.error + ' (Please contact hicube-info@caida to report this error)');
            return;
        }
        json.jsonRequestSize = xOptions.responseText.length; // Tag json size (bytes) in data
        success(json);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (textStatus === "abort") return;  // Call intentionally aborted
        const rJson = jqXHR.responseJSON;
        error((errorThrown ? errorThrown + ': ' : '') +
            (rJson && rJson.error ? rJson.error : 'An unknown error occurred'));
    });
};

CharthouseApiConnector.prototype.getHierarchicalMetaData = function (path, success, error) {

    path = path || '*';

    var disableCache = config.getParam('noCache') != null;
    var unlimit = config.getParam('unlimit') != null;

    return this._getJson(
        'GET',
        this.apiUrl + this.METRICS_QUERY_LIST,
        $.extend({
                path: path
            }, disableCache ? {noCache: true} : {}
            , unlimit ? {unlimit: true} : {}),
        disableCache ? {'Cache-Control': 'no-cache'} : {},
        success,
        error
    );
};

CharthouseApiConnector.prototype.getFunctionSpecs = function (success, error) {
    return this._getJson(
        'GET',
        this.apiUrl + this.FUNCTIONS_QUERY,
        {},
        {},
        success,
        error
    );
};

CharthouseApiConnector.prototype.getTsData = function (params, success, error) {

    params.from = params.from || '-2d';
    params.until = params.until || 'today';

    // Quadruple escape backslashes to suit backend needs. This should be fixed server-side eventually!
    //target = target.replace(/\\/g, "\\\\\\\\");

    var disableCache = config.getParam('noCache') != null;
    var unlimit = config.getParam('unlimit') != null;

    return this._getJson(
        'POST',
        this.apiUrl + this.DATA_QUERY,
        $.extend(
            {
                from: params.from,
                until: params.until,
                expression: params.expression,
                annotate: true
            },
            disableCache ? {noCache: true} : {},
            unlimit ? {unlimit: true} : {},
            params.downSampleFunc ? {downSampleFunc: params.downSampleFunc} : {}
        ),
        disableCache ? {'Cache-Control': 'no-cache'} : {},
        checkedSuccess,
        error
    );

    function checkedSuccess(json) {
        // TODO handle parsing of from/until datetime values (use moment?)
        if (Object.keys(json.data.series || []).every(function (ser) {
            let series = json.data.series[ser];
            let expectedVals = (series.until - series.from) / series.step;
            let isTimeConsistent = expectedVals === series.values.length;
            if (!isTimeConsistent) {
                error("The number of values in series " + (series.name || ser)
                    + " are inconsistent with the specified time range (" + series.from + " - " + series.until + ")"
                    + " and step of " + series.step + "s. Expected " + expectedVals + " but got " + series.values.length + ".");
            }
            return isTimeConsistent;
        })
        ) {
            success(json);
        }
    }
};

export default CharthouseApiConnector;
