import config from '../config/config';

var CharthouseApiConnector = function () {

    var apiCfg = config.getParam('api');

    this.apiUrl = apiCfg.url + '/data';
    this.timeout = (apiCfg.timeout || 20) * 1000;

    this.METRICS_QUERY_LIST = '/meta/hierarchical/list';
    this.METRICS_QUERY_SEARCH = '/meta/hierarchical/find';
    this.FUNCTIONS_QUERY = '/meta/functions';
    this.DATA_QUERY = '/ts'; //'/render/';

    // Use JSONP to work-around same origin policy, if CORS is disabled
    this.USE_JSONP = false;
};

CharthouseApiConnector.prototype._getJson = function (url, params, headerParams, success, error) {

    var MAX_GET_CHARS = 1024; // Requests above this size will use POST

    headerParams = headerParams || {};

    error = error || function () {
    }; // Error function optional

    var urlSize = url.length + 1;
    for (var p in params) {
        urlSize += p.toString().length;
        urlSize += 1;
        urlSize += params[p].toString().length;
    }

    return $.ajax({
        url: url,
        data: params,
        headers: headerParams,
        type: urlSize > MAX_GET_CHARS ? 'POST' : 'GET',
        dataType: this.USE_JSONP ? 'jsonp' : 'json',
        xhrFields: {
            withCredentials: true
        },
        timeout: this.timeout,
        success: function (json, textStatus, xOptions) {
            if (json.hasOwnProperty('error') && json.error) {
                error(json.error);
                return;
            }

            var fullGetUrl = url
                + (Object.keys(params).length ? '?' : '')
                + Object.keys(params)
                    .map(function (p) {
                        return p + '=' + params[p];
                    })
                    .join('&');

            json.jsonRequestUrl = fullGetUrl;                    // Tag url in the data
            json.jsonRequestSize = xOptions.responseText.length; // Tag json size (bytes) in data
            success(json);
        },
        error: function (xOptions, textStatus, errorThrown) {
            if (textStatus == "abort") return;  // Call intentionally aborted
            error(textStatus + (errorThrown ? ' (' + errorThrown + ')' : ''));
        }
    });
};

CharthouseApiConnector.prototype.getHierarchicalMetaData = function (path, success, error) {

    path = path || '*';

    var disableCache = config.getParam('noCache') != null;
    var unlimit = config.getParam('unlimit') != null;

    return this._getJson(
        this.apiUrl + this.METRICS_QUERY_LIST + '/json',
        $.extend({
                path: path,
                brief: true
            }, disableCache ? {noCache: true} : {}
            , unlimit ? {unlimit: true} : {}),
        disableCache ? {'Cache-Control': 'no-cache'} : {},
        success,
        error
    );
};

CharthouseApiConnector.prototype.getFunctionSpecs = function (success, error) {
    return this._getJson(
        this.apiUrl + this.FUNCTIONS_QUERY + '/json',
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
        this.apiUrl + this.DATA_QUERY + '/json',
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

CharthouseApiConnector.prototype.getSpecialTsData = function (specialUrl, success, error) {
    return this._getJson(
        this.apiUrl + specialUrl,
        {},
        {},
        success,
        error
    );
};

export default CharthouseApiConnector;
