import $ from 'jquery';
import moment from 'moment';

const CharthouseDataSet = function (apiData) {
    this.apiData = apiData;
    this.numSeries = apiData ? this.cntSeries() : 0;
};

CharthouseDataSet.prototype.get = function () {
    return this.apiData;
};

CharthouseDataSet.prototype.set = function (apiData) {
    this.apiData = apiData;
    this.numSeries = this.cntSeries();
    return this;
};

CharthouseDataSet.prototype.clone = function () {
    return new CharthouseDataSet($.extend(true, {}, this.apiData));
};

CharthouseDataSet.prototype.jsonSize = function () {
    return this.apiData.jsonRequestSize;
};

CharthouseDataSet.prototype.jsonSizeHuman = function () {
    const fileSize = this.jsonSize();
    return (fileSize < 999
            ? fileSize
            : (fileSize < 999999
                    ? ((fileSize < 9999 ? Math.round(fileSize / 100) / 10 : Math.round(fileSize / 1000)) + 'k')
                    : ((fileSize < 9999999 ? Math.round(fileSize / 100000) / 10 : Math.round(fileSize / 1000000)) + 'M')
            )
    ) + 'B';
};

CharthouseDataSet.prototype.data = function () {
    return this.apiData.data;
};

CharthouseDataSet.prototype.summary = function () {
    return this.data().summary;
};

CharthouseDataSet.prototype.series = function () {
    return this.data().series || {};
};

CharthouseDataSet.prototype.isEmpty = function () {
    // Returns false at the first occurrence of a non-null val in any series
    const series = this.series();
    return !series ||
        !Object.keys(series).some(function (serName) {
            return series[serName].values.some(function (val) {
                return val != null;
            });
        });
};

CharthouseDataSet.prototype.cntSeries = function () {
    return Object.keys(this.series()).length;
};

CharthouseDataSet.prototype.cntNonNullPnts = function () {
    let numPoints = 0;
    const series = this.series();
    Object.keys(series).forEach(function (ts) {
        numPoints += series[ts].values.filter(function (val) {
            return val != null;
        }).length;
    });
    return numPoints;
};

CharthouseDataSet.prototype.getResolution = function (durationFormatter) {
    var self = this;

    durationFormatter = durationFormatter || function (m) {
        return m;
    };

    return Object.keys(self.summary().nativeSteps || [])
        .sort(function (a, b) {
            return parseInt(a) - parseInt(b)
        })
        .map(function (nativeStep) {
            return [
                durationFormatter(moment.duration(nativeStep * 1000)),
                self.summary().nativeSteps[nativeStep]
                // Remove redundant cases that have aggregation equal only to native step
                    .filter(function (realStep) {
                        return realStep != nativeStep || self.summary().nativeSteps[nativeStep].length > 1;
                    })
                    .sort(function (a, b) {
                        return parseInt(a) - parseInt(b)
                    })
                    .map(function (s) {
                        return durationFormatter(moment.duration(s * 1000));
                    })
            ];
        });
};

CharthouseDataSet.prototype.getValRange = function () {
    var series = this.series();
    var minVal = Infinity, maxVal = -Infinity;
    Object.keys(series).forEach(function (s) {
        series[s].values.forEach(function (val) {
            if (val != null) {
                minVal = Math.min(minVal, val);
                maxVal = Math.max(maxVal, val);
            }
        });
    });
    return [minVal, maxVal];
};

CharthouseDataSet.prototype.getLatestDataTime = function () {
    // Returns latest time when values for all series were observed
    var series = this.series();

    return Math.min.apply(Math, Object.keys(series).map(function (serName) {
        // Get time of last non-null data point
        var ts = series[serName];
        for (var i = ts.values.length - 1; i >= 0; i--) {
            if (ts.values[i] != null) {
                // Found a non-null
                return i * ts.step + ts.from;
            }
        }
        return null;
    }));
};

CharthouseDataSet.prototype.toCrossfilter = function () {
    // Flatten data to be ready to feed to crossfilter
    var self = this;
    var cfData = [];

    Object.keys(self.series()).forEach(function (seriesId) {
        var series = self.series()[seriesId];

        if (!series.values) return; // No points to add

        var meta = {
            series: seriesId,
            name: series.name
        };

        if (series.annotations)
            series.annotations
                .filter(function (a) {
                    return a.type == 'join'
                })
                .forEach(function (a) {
                    meta[[a.attributes.type, a.attributes.db, a.attributes.table, a.attributes.column].join('.')] = a.attributes.id;
                    meta.dimensionId = a.attributes.dimension.id;
                    meta.dimensionName = a.attributes.dimension.name;
                });

        var runTime = series.from;
        series.values.forEach(function (val) {
            cfData.push(
                $.extend(
                    {
                        time: new Date(runTime * 1000),
                        value: val
                    },
                    meta
                )
            );

            runTime += series.step;
        });
    });

    return cfData;
};

CharthouseDataSet.prototype.diffData = function (that) {
    var diff = {
        removeSeries: [],
        addSeries: {},
        changeSeries: {}
    };

    // Removed series
    diff.removeSeries = Object.keys(this.series()).filter(
        function (serId) {
            return !that.series().hasOwnProperty(serId)
        }
    );

    for (var serId in that.series()) {
        // New series
        if (!this.series().hasOwnProperty(serId)) {
            diff.addSeries[serId] = that.series()[serId];
            continue;
        }

        var thisSer = this.series()[serId];
        var thatSer = that.series()[serId];
        var step = thisSer.step;

        // Series with discrepant step, misaligned grid
        if (thisSer.step != thatSer.step || (thisSer.from - thatSer.from) % step) {
            // Remove and add complete series
            diff.removeSeries.push(serId);
            diff.addSeries[serId] = thatSer[serId];
            continue;
        }

        // Changed series
        var diffSer = {
            shiftPts: 0,
            popPts: 0,
            appendPts: [],
            prependPts: [],
            changePts: []
        };

        // Remove points at back and front
        diffSer.shiftPts = Math.max(0, (thatSer.from - thisSer.from) / step);
        diffSer.popPts = Math.max(0, (thisSer.until - thatSer.until) / step);

        // Pre/append points
        diffSer.prependPts = thatSer.values.slice(0, Math.max(0, (thisSer.from - thatSer.from) / step));
        // Append points
        diffSer.appendPts = thatSer.values.slice(-Math.max(0, thatSer.until - thisSer.until) / step || Infinity);

        // Flag changed vals
        var offset = (thatSer.from - thisSer.from) / step;
        var idx = Math.max(0, offset);
        while (idx < thisSer.values.length && idx - offset < thatSer.values.length) {
            if (thisSer.values[idx] != thatSer.values[idx - offset]) {
                diffSer.changePts.push([idx, thatSer.values[idx - offset]]);
            }
            idx++;
        }

        if (Object.keys(diffSer).some(function (k) {
            return (diffSer[k] instanceof Array) ? diffSer[k].length : diffSer[k];
        })) {
            diff.changeSeries[serId] = diffSer;
        }
    }

    return Object.keys(diff).some(function (k) {
        return Object.keys(diff[k]).length;
    })
        ? diff
        : null;
};

CharthouseDataSet.prototype.mergeData = function (updDataSet) {

    // Work on a separate copy, in case there are merging errors
    var merged = this.clone();

    merged.summary().earliestFrom = Math.min(merged.summary().earliestFrom, updDataSet.summary().earliestFrom);
    merged.summary().lastUntil = Math.max(merged.summary().lastUntil, updDataSet.summary().lastUntil);

    Object.keys(updDataSet.series()).forEach(function (serName) {
        var updSer = updDataSet.series()[serName];

        if (!merged.series().hasOwnProperty(serName)) {
            // Series is new, update summary steps
            if (!merged.summary().nativeSteps.hasOwnProperty(updSer.nativeStep)) {
                merged.summary().nativeSteps[updSer.nativeStep] = [];
            }
            if (merged.summary().nativeSteps[updSer.nativeStep].indexOf(updSer.step) == -1) {
                merged.summary().nativeSteps[updSer.nativeStep].push(updSer.step);
            }
            if (merged.summary().steps.indexOf(updSer.step) == -1) {
                merged.summary().steps.push(updSer.step);
            }

            merged.series()[serName] = updSer;

            return;
        }

        var mergedSer = merged.series()[serName];

        if (mergedSer.step != updSer.step) {
            // Diverging step, can't merge this series
            throw {
                error: "Diverging step (" + mergedSer.step + "," + updSer.step + "), unable to merge series",
                series: serName
            };
        }

        var step = updSer.step;

        // Pad null data before & after current
        var numNulls = (mergedSer.from - updSer.from) / step;
        while (numNulls-- > 0) {   // Before
            mergedSer.values.unshift(null);
        }
        numNulls = (updSer.until - mergedSer.until) / step;
        while (numNulls-- > 0) {   // After
            mergedSer.values.push(null);
        }

        // Adjust from/until
        mergedSer.from = Math.min(mergedSer.from, updSer.from);
        mergedSer.until = Math.max(mergedSer.from, updSer.until);

        // Replace upd values in place
        mergedSer.values.splice.apply(mergedSer.values, [
                (updSer.from - mergedSer.from) / step,    // Index offset between both sets
                updSer.values.length                    // How many to override
            ].concat(updSer.values)
        );
    });

    // Merge successful, set current data
    this.set(merged.get());

    return this;
};


////////

var CharthouseCfData = function (apiDataSet) {
    this.cfObj = crossfilter(apiDataSet.toCrossfilter());
};

CharthouseCfData.prototype.get = function () {
    return this.cfObj;
};

CharthouseCfData.prototype.setData = function (apiDataSet) {
    // Ensure that all filters are off before running this, otherwise not all data will be removed
    this.cfObj.remove && this.cfObj.remove();
    this.cfObj.add(apiDataSet.toCrossfilter());
};

CharthouseCfData.prototype.getValRange = function () {
    var byVal = this.cfObj.dimension(function (d) {
        return d.value;
    });
    byVal.filter(function (val) {
        return val != null;
    });

    var valRange = byVal.top(1).length
        ? [byVal.bottom(1)[0].value, byVal.top(1)[0].value]
        : null;  // No non-null values

    byVal.filterAll();
    if (byVal.hasOwnProperty('dispose')) byVal.dispose();

    return valRange;
};

// Only use for very small diffs, otherwise the setData method performs much better
CharthouseCfData.prototype.applyDataDiff = function (origData, diff) {
    var cf = this.cfObj;
    var perTime = cf.dimension(function (d) {
        return d.time;
    });
    var perSeries = cf.dimension(function (d) {
        return d.series;
    });

    // Change series
    var addPts = [];
    Object.keys(diff.changeSeries).forEach(function (serId) {

        var curData = origData.series()[serId];
        var diffData = diff.changeSeries[serId];
        var addSeriesPts = [];

        perSeries.filterExact(serId);

        // Shift
        if (diffData.shiftPts) {
            perTime.filter([
                new Date(curData.from * 1000),
                new Date((curData.from + diffData.shiftPts * curData.step) * 1000)
            ]);
            cf.remove();
        }

        // Pop
        if (diffData.popPts) {
            perTime.filter([
                new Date((curData.until - diffData.popPts * curData.step) * 1000),
                new Date(curData.until * 1000)
            ]);
            cf.remove();
        }

        // Append
        var time = +curData.until;
        diffData.appendPts.forEach(function (val) {
            addSeriesPts.push({time: new Date(time * 1000), value: val});
            time += curData.step;
        });

        // Prepend
        time = +curData.from - curData.step * diffData.prependPts.length;
        diffData.prependPts.forEach(function (val) {
            addSeriesPts.push({time: new Date(time * 1000), value: val});
            time += curData.step;
        });

        // Change points (remove+add because changing pts is not possible in crossfilter)
        diffData.changePts.forEach(function (pt) {
            var time = new Date((curData.from + pt[0] * curData.step) * 1000);
            addSeriesPts.push({time: time, value: pt[1]});
        });

        // Bundle pts to remove into intervals to improve filter+remove performance cycle
        var removeIntervals = toIntervals(diffData.changePts.map(function (pt) {
            return pt[0];
        }));
        removeIntervals.forEach(function (interval) {
            if (interval.constructor === Array) {
                interval[1] += 1; // Exclusive end
                perTime.filterRange(interval.map(function (pos) {
                    return new Date((curData.from + pos * curData.step) * 1000)
                }));
            } else {
                perTime.filterExact(new Date((curData.from + interval * curData.step) * 1000));
            }
            cf.remove();
        });

        var seriesMeta = getSeriesMeta(serId, curData);
        addPts = addPts.concat(addSeriesPts.map(function (pt) {
            return $.extend(pt, seriesMeta);
        }));
    });

    cf.add(addPts);

    // Release time filter
    perTime.filterAll().dispose();

    // Remove series
    diff.removeSeries.forEach(function (serId) {
        perSeries.filterExact(serId);
        cf.remove();
    });

    // Add series
    if (Object.keys(diff.addSeries).length) {
        var addData = $.extend(true, {}, origData);
        addData.data.series = diff.addSeries;
        cf.add((new CharthouseDataSet(addData)).toCrossfilter());
    }

    // Release series filter
    perSeries.filterAll().dispose();

    //

    function getSeriesMeta(seriesId, seriesData) {
        var meta = {
            series: seriesId,
            name: seriesData.name
        };

        if (seriesData.annotations)
            seriesData.annotations
                .filter(function (a) {
                    return a.type == 'join'
                })
                .forEach(function (a) {
                    meta[[a.attributes.type, a.attributes.db, a.attributes.table, a.attributes.column].join('.')] = a.attributes.id;
                    meta.dimensionId = a.attributes.dimension.id;
                    meta.dimensionName = a.attributes.dimension.name;
                });

        return meta;
    }

    function toIntervals(nums) {
        var result = [];
        var prevNum = null;
        nums
            .sort(function (a, b) {
                return a - b;
            })
            .forEach(function (num) {
                var elem = num;
                if (num - 1 == prevNum) { // Sequential
                    var elem = result.pop();
                    if (elem.constructor === Array) {
                        elem.pop(); // Replace interval end
                    } else {
                        elem = [elem];  // Create array
                    }
                    elem.push(num);
                }
                result.push(elem);
                prevNum = num;
            });
        return result;
    }
};

export default {
    api: CharthouseDataSet,
    crossfilter: CharthouseCfData
};
