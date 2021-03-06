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
import bbq from 'jquery2-bbq';

import tools from '../Explorer/utils/tools';
import StaticCfg from './static';

const NS_SEP = '.';

// TODO: replace this config module with something like Redux

// internal class for holding a name-spaced config
class NsCfg {

    constructor(globalCfg, nameSpace, initOpts) {

        this.globalCfg = globalCfg;
        this.nameSpace = nameSpace || null;
        this.local = initOpts || {};
        this.subscribed = {
            null: []    // Receive any change in config in bulk
        };

        if (this.globalCfg) {   // Notify any global props change that affect local
            this.globalCfg.onParamChange(this._notifyCfgChanged.bind(this));
        }
    }

    _notifyCfgChanged(newKeyVals) {
        var cfg = this;

        var realAffected = {};
        Object.keys(newKeyVals).filter(function (k) {    // Only notify those that actually affect the get result
            if (newKeyVals[k] instanceof Array)    // Compare arrays
                return tools.setEquals(cfg.getParam(k), newKeyVals[k]);
            return cfg.getParam(k) === newKeyVals[k] || !newKeyVals[k] && cfg.getParam(k);    // Compare strings/objects
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
    }

    getParam(key, defaultVal) {
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
    }

    setParams(keyVals, persistent, global) {
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
                if (!local.hasOwnProperty(k) || keyVals[k] !== local[k]) {
                    local[k] = keyVals[k];
                    realChanges[k] = keyVals[k];
                }
            });
            this._notifyCfgChanged(realChanges);
        }
    }

    // Leaving key = null will launch notifier on any prop change
    onParamChange(cb, key) {
        key = key || null;

        // Register callbacks to notify
        if (!this.subscribed.hasOwnProperty(key))
            this.subscribed[key] = [];
        this.subscribed[key].push(cb);
    }

    unsubscribe(cb, key) {
        key = key || null;

        // Remove it from callbacks to notify
        if (!this.subscribed.hasOwnProperty(key))
            return false;  // Key not registered

        var idx;
        if ((idx = this.subscribed[key].indexOf(cb)) === -1)
            return false;   // Cb not found in this key

        this.subscribed[key].splice(idx, 1);

        return true;    // Success
    }
}

//////////

class Config {

    constructor() {
        this.nsCfgs = {
            null: new NsCfg()    // Global non-namespaced params
        };

        window.addEventListener("hashchange", this._urlParamChange.bind(this));
    }

    // Notify every namespace involved in the change
    _urlParamChange(hashChangeEvent) {
        var nsCfgs = this.nsCfgs;

        var updParams = tools.objDiff(
            $.deparam.fragment(hashChangeEvent.oldURL.includes("#") ? hashChangeEvent.oldURL : ""),
            $.deparam.fragment(hashChangeEvent.newURL.includes("#") ? hashChangeEvent.newURL : "")
        );

        var byNameSpace = {};
        Object.keys(updParams).forEach(function (p) {
            var pSplit = p.split(NS_SEP, 2).reverse();

            var ns = pSplit.length === 2 ? pSplit[1] : null;
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
    }

    nameSpace(nameSpace, optObj) {
        nameSpace = nameSpace || null;

        if (!optObj && this.nsCfgs.hasOwnProperty(nameSpace)) {
            return this.nsCfgs[nameSpace];
        }

        return (this.nsCfgs[nameSpace || null] = new NsCfg(
            (nameSpace ? this.nsCfgs[null] : null),
            nameSpace,
            optObj
        ));
    }

    // Wrapping functions applied to global (non-namespaced) cfg
    getParam(key, defaultVal) {
        return this.nsCfgs[null].getParam(key, defaultVal);
    }

    setParams(keyVals, persistent) {
        return this.nsCfgs[null].setParams(keyVals, persistent);
    }

    onParamChange(cb, key) {
        return this.nsCfgs[null].onParamChange(cb, key);
    }

    unsubscribe(cb, key) {
        return this.nsCfgs[null].unsubscribe(cb, key);
    }
}

export default new Config();   // Singleton global config
