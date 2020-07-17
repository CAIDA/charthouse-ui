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

export default {
    rawText: {
        import: import(/* webpackChunkName: "raw-text" */ './raw-text'),
        title: 'Raw Text',
        description: 'Shows a plain text representation of the data',
        dynamic: true,      // Whether it's able to receive new data after initialisation and self-update
        internal: true
    },
    table: {
        jsFile: 'plugin-table',
        title: 'Table',
        description: 'Tabulates the data',
        dynamic: true,
        internal: false
    },
    xyGraph: {
        import: import(/* webpackChunkName: "highcharts-graph" */ './highcharts-graph'),
        title: 'XY Graph',
        description: 'Shows a line/area/bar chart representation of the data',
        dynamic: true
    },
    horizonStackedSeries: {
        import: import(/* webpackChunkName: "stacked-horizon" */ './stacked-horizon'),
        title: 'Stacked Horizon Graphs',
        description: 'Shows a vertically stacked representation of the data in Horizon layout, with one line per series',
        dynamic: true
    },
    geoDistribution: {
        import: import(/* webpackChunkName: "crosslet-geomap" */ './crosslet-geomap'),
        title: 'Geographical Distribution',
        description: 'Shows a geographical spread in which the series represent different world regions',
        dynamic: true,
        internal: false
    },
    heatmap: {
        jsFile: 'plugin-xy-heatmap',
        title: 'Heat Map',
        description: 'Shows a heatmap of the data in a 2 dimensional xy plane.',
        dynamic: true,
        internal: false
    },
    correlate2Series: {
        jsFile: 'plugin-correlate-scatter',
        title: 'Correlate Series',
        description: 'Shows a scatter plot correlating the values of 2 individual series.',
        dynamic: true,
        internal: false
    },
    proportions: {
        jsFile: 'plugin-proportions',
        title: 'Proportions Charts',
        description: 'Shows a distribution of the proportions between the values in the series, in various shapes: Sunburst (radial), Bubble Chart or Tree map.',
        dynamic: true,
        internal: false
    },
    bignum: {
        jsFile: 'plugin-bignum',
        title: 'Big Numbers (Beta)',
        description: 'Grid of numbers. Useful for showing gauges on a dashboard.',
        dynamic: true,
        internal: false
    },
};
