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

import React from 'react';
import {clean_graph} from "../utils/vis";
import Chart from "react-google-charts";
import PopupModal from "./popup-modal";
import AsRank from "./asrank";

class SankeyGraph extends React.Component {

    state = {
        data: null,
    };

    constructor(props) {
        super(props);
    }

    _count_links(paths, benign_nodes, suspicious_nodes){
        let links = {};
        for (let path of paths) {
            // check if the path contains suspicous and benign nodes
            let [benign,suspicious] = [false, false];
            for(let asn of path){
                if(benign_nodes && benign_nodes.includes(asn)){
                    benign=true;
                }
                if(suspicious_nodes && suspicious_nodes.includes(asn)){
                    suspicious=true;
                }
            }
            let link_pairs = [];
            if(path.length===1){
                // single-node path
                link_pairs.push([path[0], path[0]+"_self"]);
            } else {
                // multi-node path
                for (let i = 0; i < path.length - 1; i++) {
                    let as1 = path[i];
                    let as2 = path[i + 1];
                    if (as1 === as2) {
                        continue
                    }
                    link_pairs.push([as1, as2]);
                }
            }

            for(let pair of link_pairs){
                let as1 = pair[0];
                let as2 = pair[1];
                let link = `${as1}-${as2}`;

                // the following two if statements disable painting the path segments after the suspicious/benign node
                // NOTE: we only do that for path segments that has more than one nodes
                if(!as2.includes("_self")){
                    if(suspicious_nodes && suspicious_nodes.includes(as1) && suspicious){
                        suspicious = false
                    }
                    if(benign_nodes && benign_nodes.includes(as1) && benign){
                        benign = false
                    }
                }
                if (!(link in links)) {
                    links[link] = {
                        "count":0,
                        "suspicious":suspicious,
                        "benign":benign,
                    }
                }
                links[link]["count"] += 1;
                links[link]["suspicious"] = links[link]["suspicious"] || suspicious;
                links[link]["benign"] = links[link]["benign"] || benign;
            }
        }
        return links
    }

    getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }

    /**
     * convert list of paths, each is a list of asn, into a json object for nivo sankey
     * @param paths
     */
    prepareData = (paths) => {
        let links = this._count_links(paths, this.props.benign_nodes, this.props.suspicious_nodes);
        let resData = [];
        let weight_sum = 0;
        let highlights = [];
        for(let highlight of this.props.highlights){
            highlights.push(new Set(highlight))
        }
        Object.keys(links).forEach(link => {
                let [as1, as2] = link.split("-");
                let weight = links[link]["count"];

                let benign = links[link]["benign"];
                let suspicious = links[link]["suspicious"];
                let style = "color:grey";
                if (benign && !suspicious){
                    style = "color:grey"
                } else if (benign && suspicious){
                    style = "color:orange"
                } else if (suspicious){
                    style = "color:red"
                }

                for(let highlight of highlights){
                    if(highlight.has(as1) && highlight.has(as2)){
                        style = "color:red";
                    }
                }
                resData.push([as1, as2, weight, style]);
                weight_sum += weight;
            }
        );
        return resData;
    };

    componentDidMount() {
        if ("data" in this.props) {
            this.setState(
                {
                    data: clean_graph(this.props.data)
                }
            );
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        if (this.state.data === null) {
            // if no data available
            return (
                <div>
                    No Sankey Data Available
                </div>
            )
        } else {
            let data = this.prepareData(this.state.data);
            return (

                <div>
                    <PopupModal ref={ref => this.modal = ref}/>
                    <h3> {this.props.title} </h3>
                    <Chart
                        width={"100%"}
                        height={data.length * 12 + 30}
                        chartType="Sankey"
                        title={"test"}
                        loader={<div>Loading Chart</div>}
                        options={
                            {
                                title: this.props.title,
                                sankey: {
                                    node: {
                                        interactivity: true, // Allows you to select nodes.
                                    }
                                }
                            }
                        }
                        chartEvents={[
                            {
                                eventName: 'select',
                                callback: ({ chartWrapper }) => {
                                    // on click of the AS to pop up more information
                                    /*
                                    // temporarily disabled the pop up until feature is needed
                                    const selection = chartWrapper.getChart().getSelection();
                                    if(selection.length>0){
                                        // only pop up modal when selecting (not when de-selecting)
                                        this.modal.setContent(<AsRank asn={selection[0].name}/>);
                                        this.modal.show();
                                    }
                                     */
                                },
                            },
                        ]}
                        columns={[
                            {type:"string", label:"from"},
                            {type:"string", label:"to"},
                            {type:"number", label:"count"},
                            {type:"string", role:"style"},
                        ]}
                        rows={data}
                    />

                </div>
            )
        }
    }
}

export default SankeyGraph;
