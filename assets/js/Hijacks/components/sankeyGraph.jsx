import React from 'react';
import {ResponsiveSankey} from "@nivo/sankey";

class SankeyGraph extends React.Component {

    state = {
        data: null,
    };

    /**
     * convert list of paths, each is a list of asn, into a json object for nivo sankey
     * @param data
     */
    prepareDataJson(data) {

        let nodes = new Set();
        let links = {};
        for (let path of data) {
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

        console.log("prepared data for sankey");
        console.log(resJson);

        return resJson
    }

    loadData(data) {
        this.setState({
            data: this.prepareDataJson(data),
        });
    }

    render() {
        if ("data" in this.props) {
            // allow loading data directly from props
            console.log("loading data directly from props");
            this.state.data = this.prepareDataJson(this.props.data);
        }

        if (this.state.data === null) {
            // if no data available
            return (
                <div>
                    SANKEY WAITING FOR DATA
                </div>
            )
        } else {
            return (
                <div>
                    <h3>{this.props.title}</h3>
                    <div style={{height: this.state.data.links.length * 12 + 30}}>
                        <ResponsiveSankey
                            data={this.state.data}
                            margin={{top: 40, right: 160, bottom: 40, left: 50}}
                            align="justify"
                            animate={false}
                            colors={{scheme: 'red_blue'}}
                        />
                    </div>
                </div>
            );
        }
    }
}

export default SankeyGraph;
