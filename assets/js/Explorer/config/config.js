import bbq from 'jquery2-bbq';

import tools from '../utils/tools';
import StaticCfg from './static';

var NS_SEP = '.';

var NsCfg = function (globalCfg, nameSpace, initOpts) {

    this.globalCfg = globalCfg;
    this.nameSpace = nameSpace || null;
    this.local = initOpts || {};
    this.subscribed = {
        null: []    // Receive any change in config in bulk
    };

    if (this.globalCfg) {   // Notify any global props change that affect local
        this.globalCfg.onParamChange(this._notifyCfgChanged.bind(this));
    }
};

NsCfg.prototype._notifyCfgChanged = function (newKeyVals) {

    var cfg = this;

    var realAffected = {};
    Object.keys(newKeyVals).filter(function (k) {    // Only notify those that actually affect the get result
        if (newKeyVals[k] instanceof Array)    // Compare arrays
            return tools.setEquals(cfg.getParam(k), newKeyVals[k]);
        return cfg.getParam(k) == newKeyVals[k] || !newKeyVals[k] && cfg.getParam(k);    // Compare strings/objects
    }).forEach(function (k) {
        if (cfg.subscribed.hasOwnProperty(k)) {
            cfg.subscribed[k].forEach(function (cb) {
                cb(cfg.getParam(k));
            });
        }
        realAffected[k] = cfg.getParam(k);
    });

    this.subscribed[null].forEach(function (cb) {
        cb(realAffected);
    });
};

NsCfg.prototype.getParam = function (key, defaultVal) {
    // null < StaticCfg < GlobalCfg < Local < BBQ

    var val;

    // Check persistent state
    if ((val = bbq.getState(
        [this.nameSpace, key].filter(function (d) {
            return d != null;
        }).join(NS_SEP)
    )) != null)
        return val;

    // Check local params
    if (this.local.hasOwnProperty(key))
        return this.local[key];

    // Check global params
    if (this.globalCfg && (val = this.globalCfg.getParam(key)) != null)
        return val;

    // Last chance, check static cfg
    if (StaticCfg.hasOwnProperty(key))
        return StaticCfg[key];

    // Prop not found
    return defaultVal !== undefined ? defaultVal : null;
};

NsCfg.prototype.setParams = function (keyVals, persistent, global) {
    persistent = (persistent == null ? true : persistent);
    global = global || false;

    if (global) {
        if (this.globalCfg)
            this.globalCfg.setParams(keyVals, persistent, false);
        return;
    }

    var nameSpace = this.nameSpace;
    if (persistent) {   // Push to bbq
        var pushState = $.extend({}, keyVals);
        if (nameSpace) {
            Object.keys(keyVals).forEach(function (k) {
                pushState[[nameSpace, k].join(NS_SEP)] = pushState[k];
                delete pushState[k];
            });
        }
        bbq.pushState(pushState);
    } else {            // Change local props
        var local = this.local;

        var realChanges = {};
        Object.keys(keyVals).forEach(function (k) {
            if (!local.hasOwnProperty(k) || keyVals[k] != local[k]) {
                local[k] = keyVals[k];
                realChanges[k] = keyVals[k];
            }
        });
        this._notifyCfgChanged(realChanges);
    }
};

// Leaving key = null will launch notifier on any prop change
NsCfg.prototype.onParamChange = function (cb, key) {
    key = key || null;

    // Register callbacks to notify
    if (!this.subscribed.hasOwnProperty(key))
        this.subscribed[key] = [];
    this.subscribed[key].push(cb);
};

NsCfg.prototype.unsubscribe = function (cb, key) {
    key = key || null;

    // Remove it from callbacks to notify
    if (!this.subscribed.hasOwnProperty(key))
        return false;  // Key not registered

    var idx;
    if ((idx = this.subscribed[key].indexOf(cb)) == -1)
        return false;   // Cb not found in this key

    this.subscribed[key].splice(idx, 1);

    return true;    // Success
};

//////////

var Cfg = function () {

    this.nsCfgs = {
        null: new NsCfg()    // Global non-namespaced params
    };

    window.addEventListener("hashchange", this._urlParamChange.bind(this));
};

// Notify every namespace involved in the change
Cfg.prototype._urlParamChange = function (hashChangeEvent) {

    var nsCfgs = this.nsCfgs;

    var updParams = tools.objDiff(
        $.deparam.fragment(hashChangeEvent.oldURL.includes("#") ? hashChangeEvent.oldURL : ""),
        $.deparam.fragment(hashChangeEvent.newURL.includes("#") ? hashChangeEvent.newURL : "")
    );

    var byNameSpace = {};
    Object.keys(updParams).forEach(function (p) {
        var pSplit = p.split(NS_SEP, 2).reverse();

        var ns = pSplit.length == 2 ? pSplit[1] : null;
        var key = pSplit[0];

        if (!byNameSpace.hasOwnProperty(ns))
            byNameSpace[ns] = {};

        byNameSpace[ns][key] = updParams[p][1];
    });

    Object.keys(byNameSpace).forEach(function (ns) {
        if (nsCfgs.hasOwnProperty(ns)) {
            nsCfgs[ns]._notifyCfgChanged(byNameSpace[ns]);
        }
    });
};

Cfg.prototype.nameSpace = function (nameSpace, optObj) {

    nameSpace = nameSpace || null;

    if (!optObj && this.nsCfgs.hasOwnProperty(nameSpace)) {
        return this.nsCfgs[nameSpace];
    }

    return (this.nsCfgs[nameSpace || null] = new NsCfg(
        (nameSpace ? this.nsCfgs[null] : null),
        nameSpace,
        optObj
    ));
};

// Wrapping functions applied to global (non-namespaced) cfg
Cfg.prototype.getParam = function (key, defaultVal) {
    return this.nsCfgs[null].getParam(key, defaultVal);
};

Cfg.prototype.setParams = function (keyVals, persistent) {
    return this.nsCfgs[null].setParams(keyVals, persistent);
};

Cfg.prototype.onParamChange = function (cb, key) {
    return this.nsCfgs[null].onParamChange(cb, key);
};

Cfg.prototype.unsubscribe = function (cb, key) {
    return this.nsCfgs[null].unsubscribe(cb, key);
};

export default new Cfg();   // Singleton global config
