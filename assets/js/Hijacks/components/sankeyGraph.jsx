import React from 'react';
import {ResponsiveSankey} from "@nivo/sankey";
import {clean_graph} from "../utils/vis";
import Chart from "react-google-charts";

class SankeyGraph extends React.Component {

    state = {
        data: null,
    };

    constructor(props) {
        super(props);
    }

    /**
     * convert list of paths, each is a list of asn, into a json object for nivo sankey
     * @param paths
     */
    prepareDataJsonNino = (paths) => {
        let links = this._count_links(paths);

        let resJson = {
            "nodes": [],
            "links": [],
        };
        for (let asn of nodes) {
            resJson.nodes.push({
                "id": asn,
            });
        }
        for (let link in links) {
            let [as1, as2] = link.split("-");
            let count = links[link];
            resJson.links.push({
                "source": as1,
                "target": as2,
                "value": count,
            })
        }

        return resJson
    };

    _count_links(paths){
        let nodes = new Set();
        let links = {};
        for (let path of paths) {
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
                    links[link] = 0
                }
                links[link] += 1
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
        let links = this._count_links(paths);
        let resData = [];
        let weight_sum = 0;
        console.log(this.props.benign_nodes);
        for (let link in links) {
            let [as1, as2] = link.split("-");
            let weight = this.getBaseLog(2, links[link])+1;
            let style = "color:grey";
            if(this.props.benign_nodes && this.props.benign_nodes.includes(as2)){
                    style = "color:blue";
            }
            if(this.props.suspicious_nodes && this.props.suspicious_nodes.includes(as2)){
                    style = "color:red";
            }
            resData.push([as1, as2, weight, style]);
            weight_sum += weight;
        }

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

    ninoSankey(title, data){
        let preparedData = this.prepareDataJsonNino(data);
        return (
            <div>
                <h3>{title}</h3>
                <div style={{height: data.links.length * 12 + 30}}>
                    <ResponsiveSankey
                        data={preparedData}
                        margin={{top: 40, right: 160, bottom: 40, left: 50}}
                        align="justify"
                        animate={false}
                        colors={{scheme: 'red_blue'}}
                    />
                </div>
            </div>
        );
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
            console.log(data);

            return (
                <Chart
                    width={"100%"}
                    height={data.length * 12 + 30}
                    chartType="Sankey"
                    loader={<div>Loading Chart</div>}
                    columns={[
                        {type:"string", label:"from"},
                        {type:"string", label:"to"},
                        {type:"number", label:"weight"},
                        {type:"string", role:"style"},
                    ]}
                    rows={data}
                />
            )
        }
    }
}

export default SankeyGraph;
