import $ from 'jquery';
import moment from 'moment';

import { auth } from 'Auth';
import config from 'Config';
import ExpressionFactory from '../expression/factory';

const CharthouseApiConnector = function () {

    var apiCfg = config.getParam('api');

    this.apiUrl = apiCfg.url;
    this.timeout = (apiCfg.timeout || 20) * 1000;

    this.METRICS_QUERY_LIST = '/ts/list/';
    this.FUNCTIONS_QUERY = '/expression/functions/';
    this.DATA_QUERY = '/ts/query/';
};

CharthouseApiConnector.prototype._getJson = function (httpMethod, url, params, headerParams, success, error) {
    headerParams = headerParams || {};
    headerParams['Authorization'] = 'Bearer ' + auth.getAccessToken();

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

    const disableCache = config.getParam('noCache') != null;
    const unlimit = config.getParam('unlimit') != null;

    return this._getJson(
        'POST',
        this.apiUrl + this.DATA_QUERY,
        $.extend(
            {
                from: params.from,
                until: params.until,
                annotate: true
            },
            params.expression ? {expression: params.expression} : {},
            params.expressions ? {expressions: params.expressions} : {},
            disableCache ? {noCache: true} : {},
            unlimit ? {unlimit: true} : {},
            params.downSampleFunc ? {downSampleFunc: params.downSampleFunc} : {}
        ),
        disableCache ? {'Cache-Control': 'no-cache'} : {},
        parseResponse,
        error
    );

    function parseResponse(json) {
        const allSeries = (json.data && json.data.series) ? json.data.series : {};
        const keys = Object.keys(allSeries) || [];

        /*
         * iterate over all time series and parse data values and do some sanity
         * checking on things. returning false from the 'every' callback will
         * prevent the 'success' callback from being triggered. (if this is the
         * case, the error callback should be called instead.)
         *
         * note that this is done here so that we still have the option to error
         * out if we find something amiss
         */
        if (!keys.every(function (ser) {
            const series = allSeries[ser];

            // parse the dates using moment
            // TODO: convert all use of the data to use moment
            series.from = moment(series.from).unix();
            series.until = moment(series.until).unix();

            // convert the expression json into an expression object
            series.expression = ExpressionFactory.createFromJson(series.expression);

            // check time consistency (we made changes to how graphite thinks
            // about time, so we want to check that these changes are always used)
            const expectedVals = (series.until - series.from) / series.step;
            const isTimeConsistent = expectedVals === series.values.length;
            if (!isTimeConsistent) {
                error("The number of values in series " + (series.name || ser)
                    + " are inconsistent with the specified time range (" + series.from + " - " + series.until + ")"
                    + " and step of " + series.step + "s. Expected " + expectedVals + " but got " + series.values.length + ".");
            }
            return isTimeConsistent;
        })
        ) {
            return; // no point doing further parsing
        }

        // parse the earliest_from and last_until times in the summary
        const summary = json.data ? json.data.summary : null;
        summary.earliest_from = moment(summary.earliest_from).unix();
        summary.last_until = moment(summary.last_until).unix();

        // convert the common prefix/suffix json into expression objects
        summary.common_prefix = ExpressionFactory.createFromJson(summary.common_prefix);
        summary.common_suffix = ExpressionFactory.createFromJson(summary.common_suffix);

        success(json);
    }
};

export default CharthouseApiConnector;
