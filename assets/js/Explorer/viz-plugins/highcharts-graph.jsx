import React from 'react';
import $ from 'jquery';
import moment from 'moment';
// TODO: re-apply or upgrade to version with following patch:
/*
// 2016-11-02 AK fixes bug when entire series is null, this caused highcharts
// to fall through both of these cases and emit an error.
if (!firstPoint || isNumber(firstPoint)) { // assume all points are numbers
 */
import HighStock from 'highcharts/highstock.src';

import RadioToolbar from '../components/radio-toolbar';
import tools from '../utils/tools';
import CharthouseData from '../utils/dataset.js';
import Toggle from '../components/toggle-switch';
import '../utils/proto-mods';
// TODO: can we use react-bootstrap Select for this:
import 'bootstrap-select/dist/js/bootstrap-select';
import 'bootstrap-select/dist/css/bootstrap-select.css';

const globalConstants = {
    YAXIS_COLORS: ['teal', 'sienna']
};

// Sub-Controls
// Row 1

// Y2 Series Assignment control
const Y2Control = React.createClass({

    propTypes: {
        seriesList: React.PropTypes.object.isRequired, // id=>{series}
        y2Series: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        onY2SeriesChanged: React.PropTypes.func.isRequired
    },

    componentDidMount: function () {
        this.$select = $(this.refs.selectPicker.getDOMNode());
        this.$select.selectpicker({
            style: 'btn-default btn-xs',
            size: 14,
            showIcon: false,
            countSelectedText: '{0} series selected'
        }).change(this._seriesSelectionChanged);
    },

    componentDidUpdate: function () {
        if (this.props.y2Series.length && Object.keys(this.props.seriesList).length > 1) {
            this.$select.selectpicker('val', this.props.y2Series);
        }
    },

    render: function () {
        var sList = this.props.seriesList;
        return <div
            className='text-left'
            style={{
                display: (Object.keys(this.props.seriesList).length > 1) ?
                    'inline-block' :
                    'none',
                margin: '0 5px'
            }}
        >
            <em className="small">
                Move to <span style={{color: globalConstants.YAXIS_COLORS[1]}}>secondary Y</span> axis:
            </em>
            <br/>
            <select
                ref="selectPicker"
                multiple="multiple"
                style={{verticalAlign: 'middle'}}
                disabled={this.props.seriesList.length < 2}
                title='Select series'
                data-width='250px'
                data-live-search={true}
                data-selected-text-format='count>3'
            >
                {
                    Object.keys(sList).alphanumSort()
                        .map(function (s) {
                                return <option
                                    className="small"
                                    data-icon="glyphicon-leaf"
                                    value={s}
                                    key={s}
                                >
                                    {(sList[s].name || s).abbrFit(40, .3)}
                                </option>
                            }
                        )
                }
            </select>
        </div>
    },

    _seriesSelectionChanged: function () {
        this.props.onY2SeriesChanged(this.$select.selectpicker('val') || []);
    }

});

// Point Aggregation control
const PointAggControl = React.createClass({

    propTypes: {
        interactive: React.PropTypes.bool.isRequired,
        ptsPerPx: React.PropTypes.number,
        timePerPx: React.PropTypes.string,
        aggrFunc: React.PropTypes.string.isRequired,
        onAggrFuncChanged: React.PropTypes.func.isRequired
    },

    render: function () {
        var aggrFuncs = [
            ["average", "Avg"],
            ["sum", "Sum"],
            ["high", "Max"],
            ["low", "Min"],
            ["open", "First"],
            ["close", "Close"]
        ];

        var aggrFunc = this.props.aggrFunc;
        var aggrFuncName = '';
        aggrFuncs.forEach(function (kv) {
            if (kv[0] == aggrFunc) aggrFuncName = kv[1];
        });

        return <div
            className="text-left"
            style={{
                display: (this.props.ptsPerPx && this.props.ptsPerPx !== 1) ? 'inline-block' : 'none',
                margin: '0 3px'
            }}
        >
            <em className="small">Time point aggregation:&nbsp;</em>
            {this.props.interactive && <br/>}
            <span className="form-inline">
                    {this.props.interactive && <select
                        className="form-control input-sm"
                        style={{
                            height: '18px',
                            fontSize: '.65em',
                            padding: '0 2px',
                            cursor: 'pointer'
                        }}
                        title="If there is more than one time point per pixel, which aggregation method to use to visually group the multiple values into one point"
                        onChange={this._onChange}
                        value={this.props.aggrFunc}
                    >
                        {
                            aggrFuncs.map(function (aggrFunc) {
                                return <option
                                    value={aggrFunc[0]}
                                    key={aggrFunc[0]}
                                >
                                    {aggrFunc[1]}
                                </option>
                            })
                        }
                    </select>
                    }
                <span style={{fontSize: '.6em', verticalAlign: 'middle'}}>
                        {!this.props.interactive && <span>{aggrFuncName}</span>}
                    &nbsp;of <em>{this.props.ptsPerPx}</em> pts/px (<em>{this.props.timePerPx}</em>)
                    </span>
                </span>
        </div>
    },

    _onChange: function (e) {
        this.props.onAggrFuncChanged(e.target.value);
    }

});


// Sort by method
const SortBy = React.createClass({

    propTypes: {
        sortBy: React.PropTypes.string,
        onSortByChanged: React.PropTypes.func,
        sortAscending: React.PropTypes.bool,
        onToggleSortAscending: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            sortBy: 'alpha',
            sortAscending: true,
            onSortByChanged: function (newVal) {
            },
            onToggleSortAscending: function (newVal) {
            }
        }
    },

    render: function () {

        var sortByOptions = [
            ['alpha', 'Name'],
            ['max', 'Max val'],
            ['avg', 'Avg val'],
            ['latest', 'Latest val'],
            ['recent', 'Most recent']
        ];

        return <div
            className='text-left'
            style={{display: 'inline-block', margin: '0 5px'}}
        >
            <em className="small" style={{margin: '0 3px'}}>Sort series by:</em>
            <br/>
            <span className="form-inline">
                    <select className="form-control input-sm"
                            value={this.props.sortBy}
                            title='Select method to sort the series by.'
                            style={{
                                height: 18,
                                padding: '0 2px',
                                fontSize: '.65em',
                                cursor: 'pointer'
                            }}
                            onChange={this._changedSortBy}
                    >
                            {sortByOptions.map(function (opt) {
                                return <option key={opt[0]} value={opt[0]}>
                                    {opt[1]}
                                </option>;
                            })}
                    </select>
                </span>

            <span style={{margin: '0 3px'}}>
                    <RadioToolbar
                        key="sortOrder"
                        selected={this.props.sortAscending ? 't' : 'f'}
                        description='Sort series in a descending (arrow down) or ascending (arrow up) order'
                        fontSize="9px"
                        options={[
                            {
                                val: 'f',
                                display: <small>
                                    <i className="fa fa-arrow-down"/>
                                </small>
                            },
                            {
                                val: 't',
                                display: <small>
                                    <i className="fa fa-arrow-up"/>
                                </small>
                            }
                        ]}
                        onChange={this._toggleSortAscending}
                    />
                </span>
        </div>
    },

    // Private methods
    _changedSortBy: function (e) {
        this.props.onSortByChanged(e.target.value);
    },

    _toggleSortAscending: function (newVal) {
        this.props.onToggleSortAscending(newVal == 't');
    }
});

// Y-Axis Zoom toggle
const YAxisZoomToggle = React.createClass({

    propTypes: {
        zoomMode: React.PropTypes.string.isRequired,
        onZoomModeChanged: React.PropTypes.func.isRequired
    },

    render: function () {
        return <div
            className="text-left"
            style={{
                display: 'inline-block',
                margin: '0 5px'
            }}
        >
            <em className="small">Y axis zoom:</em>
            <br/>
            <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <Toggle
                    description="Manual mode enables interactive zooming on the Y axis"
                    onToggle={this._onToggle}
                    width={60}
                    height={16}
                    on={this.props.zoomMode === "auto"}
                    textOn="Auto"
                    textOff="Manual"
                />
            </div>
        </div>
    },

    _onToggle: function (newState) {
        this.props.onZoomModeChanged(newState ? "auto" : "manual");
    }

});

// Row 2

// Downsample Notice
const DownsampledNotice = React.createClass({

    propTypes: {
        stepHuman: React.PropTypes.string
    },

    render: function () {

        if (!this.props.stepHuman) return null;

        return <span title='For improved rendering performance'>
                <b>Note: </b>Graph data downsampled to <em>
                {this.props.stepHuman}
                </em>
            </span>
    }

});

// All-Series toggle
const AllSeriesToggle = React.createClass({

    propTypes: {
        onToggleAllSeries: React.PropTypes.func.isRequired
    },

    render: function () {
        return <span>
                click series to toggle on/off, dbl-click to solo (
                <a
                    href="javascript:void(0);"
                    className="text-info"
                    title="Toggles the visibility state of all series"
                    onClick={this.props.onToggleAllSeries}
                >
                    toggle all
                </a>
                )
            </span>
    }

});

// Set of controls above the chart
const Controls = React.createClass({

    propTypes: {
        seriesList: React.PropTypes.object.isRequired, // id=>{series}
        chartType: React.PropTypes.string,
        sortBy: React.PropTypes.string.isRequired,
        sortAscending: React.PropTypes.bool.isRequired,
        y2Series: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        zoomMode: React.PropTypes.string,
        aggrPtsPerPx: React.PropTypes.number,
        aggrTimePerPx: React.PropTypes.string,
        aggrFunc: React.PropTypes.string.isRequired,
        downsampledStepHuman: React.PropTypes.string,
        interactive: React.PropTypes.bool,
        onChartTypeChanged: React.PropTypes.func.isRequired,
        onY2SeriesChanged: React.PropTypes.func.isRequired,
        onZoomModeChanged: React.PropTypes.func.isRequired,
        onAggrFuncChanged: React.PropTypes.func.isRequired,
        onToggleAllSeries: React.PropTypes.func.isRequired,
        onSortByChanged: React.PropTypes.func,
        onToggleSortAscending: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            interactive: true,
            onSortByChanged: function (newVal) {
            },
            onToggleSortAscending: function (newVal) {
            }
        }
    },

    render: function () {
        var showAllSeriesToggle = this.props.interactive && Object.keys(this.props.seriesList).length > 1;

        return <div>
            <div
                className="text-right"
                style={{marginBottom: '6px'}}
            >
                {this.props.interactive && <span style={{margin: '0 5px'}}>
                        <RadioToolbar
                            selected={this.props.chartType}
                            description='Choose chart type'
                            options={[
                                {
                                    val: 'line',
                                    display: <span><i
                                        className='fa fa-line-chart'/> Line</span>
                                },
                                {
                                    val: 'area',
                                    display: <span><i
                                        className='fa fa-area-chart'/> Stacked</span>
                                },
                                {
                                    val: 'column',
                                    display: <span><i
                                        className='fa fa-bar-chart'/> Bar</span>
                                }
                            ]}
                            onChange={this.props.onChartTypeChanged}
                        />
                    </span>}
                {this.props.interactive &&
                (Object.keys(this.props.seriesList).length > 1) && <SortBy
                    sortBy={this.props.sortBy}
                    sortAscending={this.props.sortAscending}
                    onSortByChanged={this.props.onSortByChanged}
                    onToggleSortAscending={this.props.onToggleSortAscending}
                />}
                {this.props.interactive && <Y2Control
                    seriesList={this.props.seriesList}
                    y2Series={this.props.y2Series}
                    onY2SeriesChanged={this.props.onY2SeriesChanged}
                />}
                <PointAggControl
                    interactive={this.props.interactive}
                    ptsPerPx={this.props.aggrPtsPerPx}
                    timePerPx={this.props.aggrTimePerPx}
                    aggrFunc={this.props.aggrFunc}
                    onAggrFuncChanged={this.props.onAggrFuncChanged}
                />
                {this.props.interactive && <YAxisZoomToggle
                    zoomMode={this.props.zoomMode}
                    onZoomModeChanged={this.props.onZoomModeChanged}
                />
                }
            </div>
            <div
                className="text-right text-muted"
                style={{fontSize: '.7em'}}
            >
                <DownsampledNotice
                    stepHuman={this.props.downsampledStepHuman}
                />
                <span>
                    {
                        this.props.downsampledStepHuman && showAllSeriesToggle ? ' | ' : null
                    }
                    </span>
                {showAllSeriesToggle && <AllSeriesToggle
                    onToggleAllSeries={this.props.onToggleAllSeries}
                />
                }
            </div>
        </div>;
    },

    // Private methods
    _changedSortBy: function (e) {
        this.props.onChangeSortBy(e.target.value);
    },

    _toggleSortAscending: function (newVal) {
        this.props.onToggleSortAscending(newVal == 't');
    }

});

// XY Chart
const CharthouseXYChart = React.createClass({

    const: {
        MAX_SERIES_LEGEND: 500,
        // TODO: check if these next two should still be set per-browser:
        MAX_SERIES_POINT_MARKERS: 1000,
        MAX_GRAPH_VERTICES: 100000,
        MAX_SERIES_TO_ANIMATE: 20,
        POINTS_PER_PIXEL: 2
    },

    propTypes: {
        data: React.PropTypes.instanceOf(CharthouseData.api).isRequired,
        height: React.PropTypes.number.isRequired,
        type: React.PropTypes.string.isRequired,
        sortBy: React.PropTypes.string,
        sortAscending: React.PropTypes.bool,
        y2Series: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        zoomMode: React.PropTypes.string.isRequired,
        aggrFunc: React.PropTypes.string.isRequired,
        onTimeRangeChanged: React.PropTypes.func.isRequired,
        onAggregationRatioChanged: React.PropTypes.func.isRequired,
        onDownsampledStepChanged: React.PropTypes.func.isRequired,
        showLegend: React.PropTypes.bool.isRequired,
        markers: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {
            sortBy: 'alpha',
            sortAscending: true
        }
    },

    componentDidMount: function () {
        this._draw();
        this.componentDidUpdate(this.props);
    },

    componentDidUpdate: function (prevProps) {
        var redraw = false;
        var fullRedraw = false;

        // has the data changed?
        if (prevProps.data != this.props.data) {
            var diff = prevProps.data.diffData(this.props.data);
            if (diff) {
                this._updateData(diff);
            }
        }

        // have the markers changed?
        if (prevProps.markers != this.props.markers) {
            this._updateMarkers();
        }

        // Has the chart height changed?
        if (prevProps.height != this.props.height) {
            fullRedraw = true;
        }

        // has the chart type changed?
        if (prevProps.type !== this.props.type) {
            var chartType = this.props.type;
            this.highchart.series.forEach(function (series) {
                series.update({type: chartType}, false);
                // Keep track of it in global chart options too (for global rerender)
                series.chart.options.series[series.index].type = chartType;
            });
            redraw = true;
        }

        // has the sorting method changed
        if (prevProps.sortBy !== this.props.sortBy || prevProps.sortAscending != this.props.sortAscending) {
            // Recalculate series order
            this.highchart.options.series = this._parseData(this.props.data.series());
            fullRedraw = true;
        }

        // update the y2 axis if necessary
        var y2Series = this.props.y2Series;
        var dualYAxis = (y2Series.length && y2Series.length < this.highchart.series.length);

        this.highchart.series.forEach(function (series) {
            var yAxis = 1 * (y2Series.indexOf(series.options.id) != -1);
            if (yAxis != series.options.yAxis) {
                series.update({yAxis: yAxis}, false);
                // Keep track of it in global chart options too (for global rerender)
                series.chart.options.series[series.index].yAxis = yAxis;
                redraw = true;
            }

            // Tag series label with y axis (if there's a dual axis)
            var name = series.options.name ? series.options.name.split('<span')[0] : series.options.id;
            if (dualYAxis) {
                name += '<span style="color: ' + globalConstants.YAXIS_COLORS[yAxis] + ';font-size: .7em;"> [y' + (yAxis + 1) + ']</span>';
            }
            if (series.options.name !== name) {
                series.update({name: name}, false);
                series.chart.options.series[series.index].name = name;
                redraw = true;
            }

            // Show/hide chart lines
            //$chart.highcharts().axes.slice(1,3).forEach(function (yAxis) {
            //  yAxis.update({ lineWidth:.6*dualYAxis }, false);
            //});

        });

        // change the zoom mode
        if (prevProps.zoomMode !== this.props.zoomMode) {
            this.highchart.options.chart.zoomType = this.props.zoomMode == "auto" ? "x" : "xy";
            fullRedraw = true;
        }

        // change the aggregation function
        if (prevProps.aggrFunc !== this.props.aggrFunc) {
            this.highchart.options.plotOptions.series.dataGrouping.approximation = this.props.aggrFunc;
            fullRedraw = true;
        }


        if (fullRedraw) {
            // Force re-render (w/out animation): no way to update this property dynamically
            this.highchart.options.plotOptions.series.animation = false;
            this.$chart.highcharts(this.highchart.options);
            this.highchart = this.$chart.highcharts(); // is this needed?
            this.highchart.options.plotOptions.series.animation = null;
        } else if (redraw) {
            this.highchart.redraw();
        }
    },

    mixins: [React.addons.PureRenderMixin],

    render: function () {
        return <div className="charthouse-highcharts-graph"
                    style={{height: this.props.height}} />
    },

    toggleAllSeries: function () {
        this.highchart.series.forEach(function (series) {
            series.setVisible(!series.visible, false);
        });
        this.highchart.redraw();
    },

    _draw: function () {
        const node = this.getDOMNode();
        this.node = node;

        const yRange = this.props.data.getValRange();
        const rThis = this;

        // TODO: refactor this config
        this.highchart = HighStock.stockChart(node, {
            title: {
                text: null
            },
            colors: ['rgb(31,120,180)', 'rgb(51,160,44)', 'rgb(227,26,28)',
                'rgb(255,127,0)', 'rgb(106,61,154)', 'rgb(177,89,40)',
                'rgb(166,206,227)', 'rgb(178,223,138)', 'rgb(251,154,153)',
                'rgb(253,191,111)', 'rgb(202,178,214)'],
            chart: {
                backgroundColor: null,
                style: {
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif'
                },
                zoomType: (rThis.props.zoomMode === "auto") ? 'x' : 'xy',
                spacingBottom: 0,
                events: {
                    click: function () { // Dbl-clicking on background brings all series back
                        const dblClickTime = 500; //ms

                        if (this.hasOwnProperty('chartJustClicked') && this.chartJustClicked === true) {
                            // Double-click
                            this.chartJustClicked = false;
                            rThis.highchart.series.forEach(function (series) {
                                series.setVisible(true, false);
                            });
                            this.redraw();
                            return;
                        }

                        // Normal click - flag click timeout
                        const thisChart = this;
                        thisChart.chartJustClicked = true;
                        setTimeout(function () {
                            thisChart.chartJustClicked = false;
                        }, dblClickTime);
                    },
                    load: function () {
                        rThis._chartChanged();
                    },
                    redraw: function () {
                        rThis._chartChanged();
                    }
                }
            },
            credits: {
                enabled: false
            },
            xAxis: {
                title: {
                    text: 'Time (UTC)'
                },
                type: 'datetime',
                ordinal: false,
                dateTimeLabelFormats: {
                    hour: '%l%P',
                    minute: '%l:%M%P'
                },
                // Display markers as plot lines
                plotLines: rThis._createPlotLines()
            },
            yAxis: [
                this._axisConf = {
                    title: {
                        text: this._getCommonSuffix() // series units
                    },
                    opposite: false, // Axis on left side
                    gridLineWidth: 0.6,
                    gridLineDashStyle: 'dash',
                    lineColor: globalConstants.YAXIS_COLORS[0],
                    max: yRange[1] <= 0 ? 0 : null, // Include y=0 at init time
                    min: yRange[0] >= 0 ? 0 : null, // Include y=0 at init time
                    tickPositioner: function () {
                        // Force yMin=0 for only positive vals
                        if (this.dataMin != null) {
                            // Force yMin=0 for only positive vals
                            var minOpt = (this.dataMin >= 0) ? 0 : null;
                            if (this.options.min != minOpt)
                                this.update({min: minOpt});
                        }

                        // Force yMax=0 for only negative vals
                        if (this.dataMax != null) {
                            var maxOpt = (this.dataMax <= 0) ? 0 : null;
                            if (this.options.max != maxOpt)
                                this.update({max: maxOpt});
                        }
                        return null;
                    }
                },
                $.extend({}, this._axisConf, {
                        title: null,
                        opposite: true, // Axis on right side
                        lineColor: globalConstants.YAXIS_COLORS[1]
                    }
                )
            ],
            tooltip: {
                dateTimeLabelFormats: {
                    // No point in displaying sec/msec variations
                    millisecond: "%A, %b %e, %l:%M:%S%P",
                    second: "%A, %b %e, %l:%M:%S%P",
                    minute: "%A, %b %e, %l:%M%P",
                    hour: "%A, %b %e, %l:%M%P"
                },
                valueSuffix: ' ' + this._getCommonSuffix(),
                crosshairs: true,
                snap: 10,
                //hideDelay: 5,
                /*
                // TODO: AK comments optimistically with new version of highcharts
                positioner: function () {
                    return {x: 50, y: 10};
                },
                */
                shared: false   // Include all series or just one
            },
            legend: {
                enabled: (this.props.showLegend && this.props.data.numSeries > 1 && this.props.data.numSeries <= this.const.MAX_SERIES_LEGEND),
                maxHeight: this.props.height * 0.17,
                itemStyle: {
                    width: React.findDOMNode(this).offsetWidth * 0.9, // Prevent overflow for really large series names
                    'text-decoration': 'initial'
                },
                itemHoverStyle: {
                    'text-decoration': 'underline'
                },
                margin: 5,
                padding: 5
            },

            rangeSelector: {  // Time range selector with defaults on top
                enabled: false
            },

            navigator: {  // Time control on bottom
                enabled: false
            },

            scrollbar: { // Horizontal scrollbar on bottom
                enabled: false
            },

            plotOptions: {
                series: {
                    cursor: 'auto',
                    stickyTracking: false,
                    dataGrouping: {
                        approximation: this.props.aggrFunc,
                        groupPixelWidth: this.const.POINTS_PER_PIXEL
                    },
                    events: {
                        click: function () { // Hide series on click / show-only on dbl-click
                            // TODO: can these click handlers be refactored into common funcs?
                            var dblClickTime = 300; //ms

                            if (this.hasOwnProperty('seriesJustClicked') && this.seriesJustClicked === true) {
                                // Double-click
                                clearTimeout(this.toggleTimeout);
                                this.seriesJustClicked = false;
                                rThis.highchart.series.forEach(function (series) {
                                    series.setVisible(false, false);
                                });
                                this.show();
                                return;
                            }

                            // Normal click - postpone hide action
                            var series = this;
                            series.seriesJustClicked = true;
                            this.toggleTimeout = setTimeout(function () {
                                series.seriesJustClicked = false;
                                series.hide();
                            }, dblClickTime);
                        },
                        legendItemClick: function () {  // On dbl-click show only series
                            var dblClickTime = 300; //ms

                            if (this.hasOwnProperty('legendJustClicked') && this.legendJustClicked === true) {
                                // Double-click
                                this.legendJustClicked = false;
                                rThis.highchart.series.forEach(function (series) {
                                    series.setVisible(false, false);
                                });
                                this.show();
                                return false;
                            }

                            // Normal click - attach 'just-clicked' flag and postpone redraw
                            var series = this;
                            series.legendJustClicked = true;
                            setTimeout(function () {
                                series.legendJustClicked = false;
                                rThis.highchart.redraw();
                            }, dblClickTime);
                            this.setVisible(!this.visible, false);
                            return false;
                        }
                    }
                },
                line: {
                    marker: {
                        enabled: this.props.data.numSeries > this.const.MAX_SERIES_POINT_MARKERS ? false : null,
                        radius: 1.3
                    }
                },
                area: {
                    stacking: 'normal',
                    fillOpacity: .6,
                    marker: {
                        enabled: this.props.data.numSeries > this.const.MAX_SERIES_POINT_MARKERS ? false : null,
                        radius: 1.3
                    }
                },
                column: {}
            },

            series: this._parseData(this.props.data.series())

        });
    },

    _getCommonSuffix: function() {
        const cs = this.props.data.summary().common_suffix;
        return cs ? cs.getCanonicalHumanized() : '';
    },

    _parseData: function (seriesData) {
        var seriesNames = Object.keys(seriesData);

        var numVertices = seriesNames.map(function (serName) {
            return seriesData[serName].values.cntVertices();
        }).reduce(function (a, b) {
            return a + b;
        }, 0);

        // Make sure we're downsampling to a multiple of the original time
        var downSampleRatio = Math.max(1, Math.ceil(numVertices / this.const.MAX_GRAPH_VERTICES));

        this.props.onDownsampledStepChanged(
            downSampleRatio == 1 ?
                null :
                moment.duration(seriesData[seriesNames[0]].step * 1000 * downSampleRatio).humanize());

        var chartType = this.props.type;

        seriesNames = seriesNames.sort(this._getSortMethod());

        return seriesNames.map(function (series) {
            var vals = seriesData[series];

            var numPoints = Math.ceil(vals.values.length / downSampleRatio);
            var step = vals.step * 1000 * downSampleRatio;

            var data = downSampleRatio == 1 ? vals.values : vals.values.crossSample(numPoints);

            return {
                lineWidth: 1,
                id: series,
                name: vals.contextual_name ? vals.contextual_name.abbrFit(250) : null,
                yAxis: 0,
                pointInterval: step,
                pointStart: vals.from * 1000,
                data: data,
                originalStep: vals.step * 1000,
                visible: data.some(function (val) {
                    return val != null;
                }),
                type: chartType,
            }
        });
    },

    _updateData: function (diff) {
        var chart = this.highchart;

        var newData = this.props.data;

        // If there's many series to change, redraw in bulk
        var bulkRedraw = (
            Object.keys(diff.changeSeries).length
            + Object.keys(diff.addSeries).length
            + diff.removeSeries.length
        ) > this.const.MAX_SERIES_TO_ANIMATE;

        var updAnimation = {duration: 800};

        var parsedData = this._parseData(newData.series());

        chart.series.slice().forEach(function (ser) {
            var serId = ser.options.id;

            if (diff.removeSeries.indexOf(serId) != -1) {
                // Remove series
                ser.remove(!bulkRedraw);
            }

            if (diff.changeSeries.hasOwnProperty(serId)) {
                // Modify series
                var diffSer = diff.changeSeries[serId];

                if (ser.options.pointInterval != newData.series()[serId].step * 1000
                    || diffSer.prependPts.length
                    || (diffSer.shiftPts && diffSer.shiftPts != diffSer.appendPts.length)
                    || diffSer.changePts) {
                    // If step is different, need to prepend or shift points (change series start),
                    // no choice but to replace all options
                    ser.setData(parsedData[
                            parsedData
                                .map(function (d) {
                                    return d.id;
                                })
                                .indexOf(serId)
                            ].data,
                        !bulkRedraw
                    );
                } else {
                    if (diffSer.changePts.length || diffSer.popPts) {

                        // Modify points section deactivated by above if (run series.update() instead)
                        // Highstock's addPoint() in middle is buggy and causes update issues (series.points == null)
                        // Perhaps it gets fixed in a future version.

                        // Modify points
                        diffSer.changePts.forEach(function (pt) {
                            ser.removePoint(pt[0], false);
                            ser.addPoint({
                                x: ser.options.pointStart + ser.options.pointInterval * pt[0],
                                y: pt[1]
                            }, false, false);
                        });

                        // Pop points
                        for (var i = ser.yData.length - diffSer.popPts; i < ser.yData.length; i++) {
                            ser.removePoint(i, false);
                        }

                        if (!bulkRedraw && !diffSer.appendPts.length) {
                            chart.redraw();
                        }
                    }

                    // Append points (optionally sliding window)
                    var slideWindow = (diffSer.shiftPts == diffSer.appendPts.length);
                    diffSer.appendPts.forEach(function (pt) {
                        ser.addPoint(pt, !bulkRedraw, slideWindow, updAnimation);
                    });
                }
            }
        });

        // Add series
        var seriesToAdd = Object.keys(diff.addSeries);
        parsedData.filter(function (serData) {
            return seriesToAdd.indexOf(serData.id) != -1;
        }).forEach(function (serData) {
            chart.addSeries(serData, !bulkRedraw);
        });

        // Draw changes just once
        if (bulkRedraw) chart.redraw();
    },

    _updateMarkers: function () {
        // remove all the markers
        var xAxis = this.highchart.axes[0];
        xAxis.plotLinesAndBands.forEach(function (pl) {
            xAxis.removePlotBandOrLine(pl.id);
        });

        // add the new markers
        this._createPlotLines().forEach(function (pl) {
            xAxis.addPlotBandOrLine(pl, 'plotLines');
        });
    },

    _createPlotLines: function () {
        var rThis = this;
        return [].concat.apply([], Object.keys(this.props.markers).map(function (s) {
            return rThis.props.markers[s].map(function (marker) {
                var removeLabel = function (pl) {
                    if (pl.options.label) {
                        delete pl.options.label;
                        pl.options.dashStyle = 'Solid';
                        if (pl.svgElem) {
                            pl.svgElem.destroy();
                            pl.svgElem = undefined;
                            pl.render();
                        }
                    }
                };

                var addLabel = function (pl) {
                    pl.options.label = {
                        text: '<strong>' + marker.label + '</strong>',
                        rotation: 0,
                        align: 'center',
                        y: 0
                    };
                    pl.options.dashStyle = 'Dash';
                    if (pl.svgElem) {
                        pl.svgElem.destroy();
                        pl.svgElem = undefined;
                        pl.render();
                    }
                };

                var timeCfg = marker.time ? {
                    value: marker.time * 1000,
                    milliTime: marker.time * 1000,
                } : {
                    from: marker.from * 1000,
                    to: marker.until * 1000,
                    milliTime: marker.from * 1000
                };
                return $.extend(timeCfg, {
                    id: marker.label + ':' + timeCfg.milliTime,
                    color: marker.color,
                    width: 3,
                    zIndex: 1,
                    dashStyle: marker.emphasize ? 'Dash' : 'Solid',
                    //label: {text: marker.label},
                    events: {
                        // Force showing the tooltip of points corresponding to violations
                        mouseover: function () {
                            // if a label was given, show it now
                            if (marker.label && !this.options.label) {
                                // hide all other labels
                                this.axis.plotLinesAndBands && this.axis.plotLinesAndBands.forEach(removeLabel);
                                addLabel(this);
                                return; // don't show the series tooltip
                            }

                            // if the marker is attached to a series, trigger the tooltip for that
                            var series = rThis.highchart.get(s);
                            if (series) {
                                // Choose the point closest to milliTime to display tooltip on.
                                // When there are so many points that the graph cannot display all of them,
                                // the default value in the tooltip may be different from the y value of this point
                                var index = indexOfSeries(series.points, timeCfg.milliTime, 'x');
                                if (index % 1 != 0) {
                                    var floor = Math.floor(index),
                                        ceil = Math.ceil(index);
                                    index = (Math.abs(timeCfg.milliTime - series.points[ceil].x) <
                                        Math.abs(timeCfg.milliTime - series.points[floor].x))
                                        ? ceil
                                        : floor;
                                }

                                // currMarker = marker;
                                rThis.highchart.tooltip.refresh(series.points[index]);
                            }
                        },
                        mouseout: function () {
                            removeLabel(this);
                        }
                    }
                });
            });
        })).sort(function (a, b) {
            return (a.time) ?
                b.time - a.time
                : (b.to - b.from) - (a.to - a.from);
        });

        // Series: sorted, and difference between each pair of adjacent numbers is almost the same
        // TODO: put this func in the correct place
        function indexOfSeries(arr, val, property) {
            var key = function (d) {
                return (property == null) ? d : d[property];
            };
            var start = key(arr[0]),
                end = key(arr[arr.length - 1]),
                step = (end - start) / (arr.length - 1);
            return (start <= val && val <= end)
                ? (val - start) / step
                : null;
        }
    },

    _chartChanged: function () {
        const highchart = this.highchart;
        if (!highchart) {
            // race condition while chart is being built
            return;
        }
        var xRange = [
            highchart.axes[0].getExtremes().userMin
            || highchart.axes[0].getExtremes().dataMin
            || null,
            highchart.axes[0].getExtremes().userMax
            || highchart.axes[0].getExtremes().dataMax
            || null
        ];

        // signal to the parent that the time range has changed
        this.props.onTimeRangeChanged(xRange[0], xRange[1]);

        // update time point aggregation info
        var smallestStep = Math.min.apply(Math,
            highchart.options.series.map(function (s) {
                return s.pointInterval;
            })
        );
        var numAggrPoints = Math.ceil(
            (xRange[1] - xRange[0])                   // Data time range
            / smallestStep                          // Highest time granularity of data
            / highchart.plotWidth         // Chart plot area width in px
            * this.const.POINTS_PER_PIXEL                      // # pxs per point group
        );

        this.props.onAggregationRatioChanged(
            numAggrPoints,
            moment.duration(numAggrPoints * smallestStep).humanize()
        );
    },

    _getSortMethod: function () {

        var props = this.props;
        var ascending = this.props.sortAscending;

        // Alphabetically or default
        if (props.sortBy === 'alpha' || ['alpha', 'max', 'avg', 'latest', 'recent'].indexOf(props.sortBy) == -1) {
            return function (a, b) {
                return (ascending ? 1 : -1) * ((a > b) ? 1 : -1);
            };
        }

        // For the remaining methods, we must pre-process data for sorting performance
        var seriesData = this.props.data.data().series;
        var preProcessData = {};

        Object.keys(seriesData).forEach(function (s) {
            switch (props.sortBy) {
                case 'max':
                    preProcessData[s] = Math.max.apply(Math, seriesData[s].values);
                    break;
                case 'avg':
                    var sum = 0, cnt = 0;
                    seriesData[s].values.filter(function (val) {
                        return val != null;
                    }).forEach(function (val) {
                        sum += val;
                        cnt++;
                    });
                    preProcessData[s] = cnt ? sum / cnt : null;
                    break;
                case 'latest':
                    preProcessData[s] = null;
                    seriesData[s].values.slice().reverse().some(function (val) {
                        if (val != null) {
                            preProcessData[s] = val;
                            return true;    // Break out of loop
                        }
                    });
                    break;
                case 'recent':
                    preProcessData[s] = seriesData[s].until + seriesData[s].step;
                    seriesData[s].values.slice().reverse().some(function (val) {
                        preProcessData[s] -= seriesData[s].step;
                        return val != null;   // Break out of loop
                    });
                    break;
                default:
                    break;
            }
        });

        return function (a, b) {
            return (ascending ? 1 : -1) * (preProcessData[a] - preProcessData[b]);
        };
    }

});

// Main HighCharts viz component
const HighchartsGraph = React.createClass({

    const: {
        VERTICAL_HEADROOM: 85,
        VERTICAL_HEADROOM_NO_CONTROLS: 75
    },

    propTypes: {
        data: React.PropTypes.instanceOf(CharthouseData.api).isRequired,
        markers: React.PropTypes.object,
        configMan: React.PropTypes.object,
        maxHeight: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            configMan: {
                getParam: function (key) {
                },
                setParams: function (keVals) {
                },
                onParamChange: function (cb, key) {
                },
                unsubscribe: function (cb, key) {
                }
            },
            maxHeight: window.innerHeight * .7,
            markers: {}
        }
    },

    getInitialState: function () {

        var showControls = this.props.configMan.getParam('showControls', true);
        var ascending = this.props.configMan.getParam('sortAscending', true);
        var showLegend = this.props.configMan.getParam('showLegend', true);

        return {
            visibleFrom: this.props.data.summary().earliest_from * 1000,
            visibleUntil: this.props.data.summary().last_until * 1000,
            chartType: this.props.configMan.getParam('chartType') || 'line',
            sortBy: this.props.configMan.getParam('sortBy') || '',
            sortAscending: tools.fuzzyBoolean(ascending),
            y2Series: this._filterExistingSeries(this.props.configMan.getParam('y2Series') || []),
            zoomMode: "auto", // or "manual"
            aggrPtsPerPx: null,
            aggrTimePerPx: null,
            pntAggregation: this.props.configMan.getParam('pntAggregation') || "average",
            downsampledStepHuman: null,
            showControls: tools.fuzzyBoolean(showControls),
            showLegend: tools.fuzzyBoolean(showLegend)
        }
    },

    componentWillMount: function () {
        this.props.configMan.onParamChange(this._configChanged);
    },

    componentWillUnmount: function () {
        this.props.configMan.unsubscribe(this._configChanged);
    },

    componentWillUpdate: function (nextProps) {
        if (nextProps.data != this.props.data) {
            this._onY2SeriesChanged(this._filterExistingSeries(this.props.configMan.getParam('y2Series') || []));
        }
    },

    render: function () {

        return <div>
            <Controls
                interactive={this.state.showControls}
                seriesList={this.props.data.series()}
                chartType={this.state.chartType}
                y2Series={this.state.y2Series}
                zoomMode={this.state.zoomMode}
                aggrPtsPerPx={this.state.aggrPtsPerPx}
                aggrTimePerPx={this.state.aggrTimePerPx}
                aggrFunc={this.state.pntAggregation}
                downsampledStepHuman={this.state.downsampledStepHuman}
                sortBy={this.state.sortBy}
                sortAscending={this.state.sortAscending}
                onChartTypeChanged={this._onChartTypeChanged}
                onY2SeriesChanged={this._onY2SeriesChanged}
                onZoomModeChanged={this._onZoomModeChanged}
                onAggrFuncChanged={this._onAggrFuncChanged}
                onToggleAllSeries={this._onToggleAllSeries}
                onSortByChanged={this._changeSortBy}
                onToggleSortAscending={this._toggleSortAscending}
            />
            <CharthouseXYChart
                ref="charthouseXY"
                data={this.props.data}
                markers={this.props.markers}
                height={Math.max(this.props.maxHeight - (this.state.showControls ? this.const.VERTICAL_HEADROOM : this.const.VERTICAL_HEADROOM_NO_CONTROLS), 100)}
                type={this.state.chartType}
                y2Series={this.state.y2Series}
                zoomMode={this.state.zoomMode}
                aggrFunc={this.state.pntAggregation}
                sortBy={this.state.sortBy}
                sortAscending={this.state.sortAscending}
                onTimeRangeChanged={this._onTimeRangeChanged}
                onAggregationRatioChanged={this._onAggregationRatioChanged}
                onDownsampledStepChanged={this._onDownsampledStepChanged}
                showLegend={this.state.showLegend}
            />
        </div>

    },

    // Private methods
    _configChanged: function (newParams) {
        var rThis = this;

        var keepProps = [
            'chartType',
            'y2Series',
            'pntAggregation',
            'sortBy',
            'sortAscending'
        ];

        var updState = {};
        var defaults;
        Object.keys(newParams).forEach(function (k) {
            if (keepProps.indexOf(k) != -1) {

                if (newParams[k] == null && defaults == null)
                    defaults = rThis.getInitialState();  // Populate defaults

                updState[k] = (newParams[k] != null
                        ? parse(newParams[k])
                        : defaults[k]
                );
            }
        });

        if (updState.hasOwnProperty('y2Series')) {
            updState.y2Series = this._filterExistingSeries(updState.y2Series);
        }

        if (Object.keys(updState).length) {
            this.setState(updState);
        }

        function parse(val) {
            if (typeof val == 'string' && val.length) {
                var valLc = val.toLowerCase();
                if (valLc == 'false' || valLc == 'true')
                    return (valLc != 'false');  // Boolean

                if (!isNaN(val))
                    return +val;        // Number
            }

            return val;
        }
    },

    _filterExistingSeries: function (seriesToFilter) {
        seriesToFilter = Array.isArray(seriesToFilter) ? seriesToFilter : [seriesToFilter];
        var series = this.props.data.series();
        return seriesToFilter.filter(function (s) {
            return series.hasOwnProperty(s);
        });
    },

    _onTimeRangeChanged: function (newFrom, newUntil) {
        this.setState({
            visibleFrom: newFrom || this.props.data.summary().earliest_from * 1000,
            visibleUntil: newUntil || this.props.data.summary().last_until * 1000
        });
        this.props.onTimeChange([this.state.visibleFrom, this.state.visibleUntil])
    },

    _onAggregationRatioChanged: function (aggrPoints, aggrTime) {
        this.setState({aggrPtsPerPx: aggrPoints, aggrTimePerPx: aggrTime});
    },

    _onChartTypeChanged: function (newType) {
        this.props.configMan.setParams({'chartType': newType});
    },

    _onY2SeriesChanged: function (y2Series) {
        this.props.configMan.setParams({'y2Series': y2Series});
    },

    _onZoomModeChanged: function (newZoomMode) {
        this.setState({zoomMode: newZoomMode});
    },

    _onAggrFuncChanged: function (newFunc) {
        this.props.configMan.setParams({pntAggregation: newFunc});
    },

    _onToggleAllSeries: function () {
        this.refs.charthouseXY.toggleAllSeries();
    },

    _onDownsampledStepChanged: function (dss) {
        this.setState({downsampledStepHuman: dss})
    },

    _changeSortBy: function (newMethod) {
        this.props.configMan.setParams({sortBy: newMethod});
    },

    _toggleSortAscending: function (newVal) {
        this.props.configMan.setParams({sortAscending: newVal});
    }

});

export default HighchartsGraph;
