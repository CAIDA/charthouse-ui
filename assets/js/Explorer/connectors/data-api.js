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

    var xThis = this;
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
        timeout: xThis.timeout,
        success: function (json, textStatus, xOptions) {
            if (json.hasOwnProperty('error') && json.error) {
                // shouldn't happen. errors should return HTTP error codes
                error(json.error + ' (Please contact hicube-info@caida to report this error)');
                return;
            }
            json.jsonRequestSize = xOptions.responseText.length; // Tag json size (bytes) in data
            success(json);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var json = JSON.parse(jqXHR.responseText);
            if (textStatus === "abort") return;  // Call intentionally aborted
            error((errorThrown ? errorThrown + ': ' : '') + json.error);
        }
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
        if (Object.keys(json.data.series || []).every(function (ser) {
            var series = json.data.series[ser];
            var isTimeConsistent = (series.until - series.from) / series.step == series.values.length;
            if (!isTimeConsistent) {
                error("The " + series.values.length + " values in series " + (series.name || ser)
                    + " are inconsistent with the specified time range (" + series.from + " - " + series.until + ")"
                    + " and step of " + series.step + "s.");
            }
            return isTimeConsistent;
        })
        ) {
            success(json);
        }
    }
};

export default CharthouseApiConnector;
