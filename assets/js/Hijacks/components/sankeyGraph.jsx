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
        this.modal_content = "test";
    }

    _count_links(paths, benign_nodes, suspicious_nodes){
        let nodes = new Set();
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
            for (let i = 0; i < path.length - 1; i++) {
                let as1 = path[i];
                let as2 = path[i + 1];
                if (as1 === as2) {
                    continue
                }
                nodes.add(as1);
                nodes.add(as2);
                let link = `${as1}-${as2}`;
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
        console.log(this.props);
        let links = this._count_links(paths, this.props.benign_nodes, this.props.suspicious_nodes);
        let resData = [];
        let weight_sum = 0;
        Object.keys(links).forEach(link => {
                let [as1, as2] = link.split("-");
                // let weight = this.getBaseLog(2, links[link]["count"])+1;
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
