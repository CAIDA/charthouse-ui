import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import dc from '../libs/dc/dc.custom';
import moment from 'moment';

import '../utils/proto-mods';

var PlayBtn = React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        faIcon: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },

    render: function () {

        return <button type="button"
                       className="btn btn-primary"
                       title={this.props.title}
                       style={{margin: .5}}
                       onClick={this.props.onClick}
        >
            <i className={"fa " + this.props.faIcon}/>
        </button>
    }
});

// TODO PureComponent
/*
    getDefaultProps: function () {
        return {
            onStop: function () {
            },
            onPlayFwd: function () {
            },
            onPauseFwd: function () {
            },
            onPlayRev: function () {
            },
            onPauseRev: function () {
            },
            onStepFwd: function () {
            },
            onStepBck: function () {
            }
        };
    },

    getInitialState: function () {
        return {
            stop: true,
            playFwd: true,
            playRev: true,
            pauseFwd: false,
            pauseRev: false,
            stepFwd: true,
            stepBck: true
        }
    },
 */
var PlayControls = React.createClass({

    propTypes: {
        onStop: React.PropTypes.func,
        onPlayFwd: React.PropTypes.func,
        onPauseFwd: React.PropTypes.func,
        onPlayRev: React.PropTypes.func,
        onPauseRev: React.PropTypes.func,
        onStepFwd: React.PropTypes.func,
        onStepBck: React.PropTypes.func
    },

    render: function () {

        return <React.addons.CSSTransitionGroup
            transitionName="fade"
            transitionLeave={false}
            component="div"
            className="btn-group btn-group-xs"
        >
            {this.state.stepBck
                ? <PlayBtn
                    key="stepBck"
                    title="Step back one frame"
                    faIcon="fa-step-backward"
                    onClick={this.props.onStepBck}
                /> : null
            }
            {this.state.playRev
                ? <PlayBtn
                    key="playRev"
                    title="Play backwards"
                    faIcon="fa-play fa-flip-horizontal"
                    onClick={this._playRev}
                /> : null
            }
            {this.state.pauseRev
                ? <PlayBtn
                    key="pauseRev"
                    title="Pause playing"
                    faIcon="fa-pause"
                    onClick={this._pauseRev}
                /> : null
            }
            {this.state.stop
                ? <PlayBtn
                    key="stop"
                    title="Stop playing"
                    faIcon="fa-stop"
                    onClick={this._stop}
                /> : null
            }
            {this.state.playFwd
                ? <PlayBtn
                    key="playFwd"
                    title="Play"
                    faIcon="fa-play"
                    onClick={this._playFwd}
                /> : null
            }
            {this.state.pauseFwd
                ? <PlayBtn
                    key="pauseFwd"
                    title="Pause playing"
                    faIcon="fa-pause"
                    onClick={this._pauseFwd}
                /> : null
            }
            {this.state.stepFwd
                ? <PlayBtn
                    key="stepFwd"
                    title="Step forward one frame"
                    faIcon="fa-step-forward"
                    onClick={this.props.onStepFwd}
                /> : null
            }
        </React.addons.CSSTransitionGroup>;
    },

    // Private methods
    _playFwd: function () {
        this.setState({
            playFwd: false,
            pauseFwd: true,
            playRev: true,
            pauseRev: false
        });
        this.props.onPlayFwd();
    },

    _pauseFwd: function () {
        this.setState({
            playFwd: true,
            pauseFwd: false,
            playRev: true,
            pauseRev: false
        });
        this.props.onPauseFwd();
    },

    _playRev: function () {
        this.setState({
            playFwd: true,
            pauseFwd: false,
            playRev: false,
            pauseRev: true
        });
        this.props.onPlayRev();
    },

    _pauseRev: function () {
        this.setState({
            playFwd: true,
            pauseFwd: false,
            playRev: true,
            pauseRev: false
        });
        this.props.onPauseRev();
    },

    _stop: function () {
        this.resetState();
        this.props.onStop();
    },

    // Public methods
    resetState: function () {
        // TODO
        //this.setState(this.getInitialState());
    }

});

// TODO PureComponent
/*
    getDefaultProps: function () {
        return {
            timeCol: 'time',
            idCol: 'series',
            nameCol: 'name',
            maxSeries: 5,
            onFiltered: function () {
            }
        }
    },

   getInitialState: function () {
        var timeCol = this.props.timeCol;
        return {
            byTime: this.props.cfData.dimension(function (d) {
                return d[timeCol];
            })
        }
    },
 */
var DcLineChart = React.createClass({

    propTypes: {
        cfData: React.PropTypes.object.isRequired,
        timeCol: React.PropTypes.string.isRequired,
        idCol: React.PropTypes.string.isRequired,
        nameCol: React.PropTypes.string.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        maxSeries: React.PropTypes.number,
        onFiltered: React.PropTypes.func
    },

    componentDidMount: function () {
        var rThis = this;

        this.chart = dc.lineChart(ReactDOM.findDOMNode(this.refs.chartElem))
            .renderArea(true)
            .width(this.props.width)
            .height(this.props.height)
            .dimension(this.state.byTime)
            .x(d3.time.scale.utc().domain(this._getTimeRange()))
            .on("filtered", function () {
                rThis.props.onFiltered(rThis.getCurrentSelection());
            });

        this.chart.margins().top = 15;
        this.chart.margins().bottom = 17;
        this.chart.margins().left = 15;
        this.chart.margins().right = 15;

        this.chart.xAxis()
            .ticks(Math.ceil(this.props.width / 100))  // One tick every ~100px
            .tickFormat(d3.time.format.utc.multi([
                [".%L", function (d) {
                    return d.getUTCMilliseconds();
                }],
                [":%S", function (d) {
                    return d.getUTCSeconds();
                }],
                ["%-I:%M", function (d) {
                    return d.getUTCMinutes();
                }],
                ["%-I%p", function (d) {
                    return d.getUTCHours();
                }],
                ["%a %-d", function (d) {
                    return d.getUTCDay() && d.getUTCDate() != 1;
                }],
                ["%b %-d", function (d) {
                    return d.getUTCDate() != 1;
                }],
                ["%b", function (d) {
                    return d.getUTCMonth();
                }],
                ["%Y", function () {
                    return true;
                }]
            ]));

        var dimensionLst = this._getDimensions();

        // Attach all dimensions
        var first = true;
        var seriesLeft = this.props.maxSeries;
        dimensionLst.some(function (dim) {
            if (!seriesLeft--) return true; // Only plot up to MAXSERIES (for performance)
            rThis.chart[first ? 'group' : 'stack'](
                rThis.state.byTime.group().reduceSum(function (row) {
                    return (row[rThis.props.idCol] == dim.id ? row.value : 0);
                }),
                dim.name.abbrFit(15, 0.3, '..')
            );
            first = false;
        });

        // Add legend if more than one dimension
        if (dimensionLst.length > 1 && dimensionLst.length < this.props.maxSeries) {
            this.chart.legend(dc.legend()
                .x(35)
                .y(4)
                .itemHeight(5)
                .itemWidth(80)
                .horizontal(true)
            );
        }

        this.chart.render();
    },

    componentDidUpdate: function (prevProps) {
        if (this.props.width != prevProps.width || this.props.height != prevProps.height) {
            this.chart.width(this.props.width);
            this.chart.height(this.props.height);
            this.chart.xAxis().ticks(Math.ceil(this.props.width / 100));  // One tick every ~100px
            this.chart.render();
        }
    },

    render: function () {
        return <div ref="chartElem"/>;
    },

    // Private methods
    _getTimeRange: function () {
        if (!this.state.byTime.top(1).length) {
            // No data points (post-filter)
            return null;
        }

        return [
            +(this.state.byTime.bottom(1)[0].time),
            +(this.state.byTime.top(1)[0].time)
        ];
    },

    // Returns set of unique dimension id > name pairs
    _getDimensions: function () {
        var rThis = this;

        var byDimensionId = this.props.cfData.dimension(function (d) {
            return d[rThis.props.idCol];
        });

        var dimensionLst = byDimensionId.group()
            .reduce(
                function reduceAdd(p, v) {
                    return p || v[rThis.props.nameCol];
                },
                function reduceRemove(p) {
                    return p;
                },
                function reduceInit() {
                    return null;
                }
            )
            .orderNatural()
            .all()
            .map(function (dimension) {
                return {
                    id: dimension.key,
                    name: dimension.value || ' '
                };
            });

        // GC dimension & group when possible
        if (byDimensionId.hasOwnProperty('dispose')) byDimensionId.dispose();

        return dimensionLst;
    },

    // Public methods
    onCfDataChange: function () {
        this.chart.x(d3.time.scale.utc().domain(this._getTimeRange()));
        this.chart.render();
    },

    getCurrentSelection: function () {
        var curFilter = this.chart.filter();
        if (!curFilter) return curFilter;   // No selection

        return curFilter.map(function (d) {
            return +d;  // Convert date to unix tstamp
        });
    },

    selectRange: function (range) {
        this.chart.filterAll(); // Always reset selection first

        if (range && range[0] && range[1]) {

            var timeRange = this._getTimeRange();

            var filter = range.sort();                      // Make sure it's ordered

            if (filter[1] < timeRange[0] || filter[0] > timeRange[1])
                return false;   // Out of time range

            filter[0] = Math.max(filter[0], timeRange[0]);  // And within bounds
            filter[1] = Math.min(filter[1], timeRange[1]);
            filter[1] += 1;                                 // Filter range is incl-excl
            this.chart.filter(filter);
        }
        this.chart.redraw();                                // Redraw graph

        return true;
    }

});

// Main time player/filter component
const FILTER_DAMPER_DELAY = 50; // ms

// TODO: LinkedState
/*
    getDefaultProps: function () {
        return {
            width: 640,
            height: 120,
            idCol: 'dimensionId',
            nameCol: 'dimensionName',
            maxFps: 25,
            fps: 2,
            showPlayControls: true,
            onFilterChange: function () {
            },
            onFpsChange: function (newFps) {
            }
        };
    },

    getInitialState: function () {
        return {
            byTime: this.props.cfData.dimension(function (d) {
                return d.time;
            }),
            dataStep: null,
            timeRange: [null, null],
            filterRange: [null, null],
            frameSize: null,
            playerWidth: null
        }
    },
 */
const Player = React.createClass({

    propTypes: {
        cfData: React.PropTypes.object.isRequired,
        idCol: React.PropTypes.string,       // Related to cf data
        nameCol: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        maxFps: React.PropTypes.number,
        fps: React.PropTypes.number,
        showPlayControls: React.PropTypes.bool,
        onFilterChange: React.PropTypes.func,
        onTimeChange: React.PropTypes.func,
        onFpsChange: React.PropTypes.func
    },

    componentWillMount: function () {
        this._setTimeRange();

        var dataStep = this._getDataStep();
        this.setState({
            dataStep: dataStep,
            frameSize: dataStep
        });
    },

    componentDidMount: function () {
        this.setState({
            playerWidth: (this.props.showPlayControls
                ? ReactDOM.findDOMNode(this.refs.controlPanel).offsetWidth
                : 0)
        });

        this.curPlayTimeout = null;
    },

    componentWillUnmount: function () {
        clearTimeout(this.curPlayTimeout);  // Cancel timeout if currently playing
    },

    render: function () {

        var frameSizes = this._getFrameSizeOptions();

        return <div style={{
            height: this.props.height,
            margin: 0,
            border: '1px solid #DDD',
            WebkitBorderRadius: 4,
            MozBorderRadius: 4,
            borderRadius: 4
        }}>
            {this.props.showPlayControls && <div className="well text-center"
                                                 ref="controlPanel"
                                                 style={{
                                                     height: '100%',
                                                     padding: 2,
                                                     marginBottom: 0,
                                                     float: 'left'
                                                 }}
            >
                <div style={{margin: (this.props.height - 45) * .33 + 'px 0'}}>
                    <PlayControls
                        ref="playControls"
                        onPlayFwd={this._playFwd}
                        onPlayRev={this._playRev}
                        onPauseFwd={this._pauseIt}
                        onPauseRev={this._pauseIt}
                        onStepFwd={this._stepFwd}
                        onStepBck={this._stepBck}
                        onStop={this._stopIt}
                    />
                </div>
                <div className="form-inline">
                    <select className="form-control input-sm"
                            valueLink={this.linkState('frameSize')}
                            style={{
                                margin: 1,
                                height: 15,
                                padding: 0,
                                fontSize: '.6em',
                                cursor: 'pointer'
                            }}
                    >
                        {frameSizes.map(function (size) {
                            return <option key={size} value={size}>
                                {moment.duration(size).humanize() + ' /frame'}
                            </option>;
                        })}
                    </select>
                    <select className="form-control input-sm"
                            value={this.props.fps}
                            style={{
                                margin: 1,
                                height: 15,
                                padding: 0,
                                fontSize: '.6em',
                                cursor: 'pointer'
                            }}
                            onChange={this._fpsChanged}
                    >
                        {this._getFpsOptions().map(function (fps) {
                            return <option key={fps}
                                           value={fps}>{fps + " fps"}</option>
                        })}
                    </select>
                </div>
            </div>
            }
            <div style={{float: 'left'}}>
                {this.state.playerWidth != null
                    ? <DcLineChart
                        ref="dcLineChart"
                        cfData={this.props.cfData}
                        timeCol='time'
                        idCol={this.props.idCol}
                        nameCol={this.props.nameCol}
                        width={this.props.width - this.state.playerWidth - 15}
                        height={this.props.height - 20 /* Allow space for time logger below */}
                        onFiltered={this._chartFiltered}
                    />
                    : null
                }
            </div>
        </div>;
    },

    // Private methods
    _getDataStep: function () {
        var grByTime = this.state.byTime.group();

        var step = grByTime.size() < 2 ? 1 : (
            grByTime.all().slice(0, 2).reduce(function (first, second) {
                return second.key - first.key;
            })
        );

        if (grByTime.hasOwnProperty('dispose')) grByTime.dispose();
        return step;
    },

    _setTimeRange: function () {
        var tr = [
            +(this.state.byTime.bottom(1)[0].time),
            +(this.state.byTime.top(1)[0].time)
        ];
        this.setState({
            timeRange: tr
        });
        if (this.props.onTimeChange) {
            this.props.onTimeChange(tr);
        }
    },

    _getFrameSizeOptions: function () {
        var INCREASE_RATE = 2;

        var minVal = this.state.dataStep;
        var maxVal = (this.state.timeRange[1] - this.state.timeRange[0]) / 2;

        var opts = [];
        for (var i = minVal; i <= maxVal; i *= INCREASE_RATE) {
            opts.push(i);
        }

        return opts;
    },

    _getFpsOptions: function () {
        var MIN_VAL = 1;
        var INCREASE_STEP = 1;

        var opts = [];
        for (var i = MIN_VAL; i <= this.props.maxFps; i += INCREASE_STEP) {
            opts.push(i);
        }
        return opts;
    },

    _fpsChanged: function (e) {
        this.props.onFpsChange(+e.target.value);
    },

    _chartFiltered: function (range) {
        var curRange = this.state.filterRange;
        if (range !== curRange
            && (!range || range[0] !== curRange[0] || range[1] !== curRange[1])) {
            this.setState({filterRange: range || [null, null]});

            if (this.props.onTimeChange) {
                this.props.onTimeChange(range || this.state.timeRange);
            }

            // Bounce propagation of multiple filter events
            if (this.filterDamper !== false)
                clearTimeout(this.filterDamper);
            this.filterDamper = setTimeout(
                this.props.onFilterChange,
                FILTER_DAMPER_DELAY
            );
        }
    },

    _playIt: function (rev) {
        rev = rev || false;

        var rThis = this;

        if (this.curPlayTimeout) {
            // Cancel current play
            this._pauseIt();
        }

        (function playFrame() {
            var enterTime = new Date();
            if (rThis._playOneFrame(rev)) {
                rThis.curPlayTimeout = setTimeout(
                    playFrame,
                    Math.max(1, 1000 / rThis.props.fps - (new Date() - enterTime))
                );
            } else {    // Reached end
                rThis.curPlayTimeout = null;
                rThis.refs.playControls.resetState();
                rThis.refs.dcLineChart.selectRange(null);
            }
        })(); //Run at once first time
    },

    _playFwd: function () {
        this._playIt(false);
    },
    _playRev: function () {
        this._playIt(true);
    },

    _pauseIt: function () {
        if (this.curPlayTimeout) {
            clearTimeout(this.curPlayTimeout);
            this.curPlayTimeout = null;
        }
    },

    _playOneFrame: function (rev) {
        var STEPS_BY_FRAME_SIZE = 1; // How many steps to play through a frame length

        rev = rev || false;

        var step = this.state.frameSize / STEPS_BY_FRAME_SIZE;

        var curPos = this.refs.dcLineChart.getCurrentSelection();
        var timeHead = +(curPos || this.state.timeRange)[rev ? 1 : 0];
        if (curPos) {
            timeHead += step * (rev ? -1 : 1); // Move time head if some interval already selected
        }

        return this.refs.dcLineChart.selectRange([timeHead, timeHead + (this.state.frameSize - 1) * (rev ? -1 : 1)]);
    },

    _stepFwd: function () {
        this._playOneFrame(false);
    },
    _stepBck: function () {
        this._playOneFrame(true);
    },

    _stopIt: function () {
        this._pauseIt();
        this.refs.dcLineChart.selectRange(null);   // Clear selection
    },

    // Public methods
    stop: function () {
        this._stopIt();
        if (this.props.showPlayControls)
            this.refs.playControls.resetState();
    },

    onCfDataChange: function () {
        this._setTimeRange();
        this.refs.dcLineChart.onCfDataChange();
    }

});

export default Player;
