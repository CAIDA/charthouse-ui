import React from 'react';
import {ResponsiveSankey} from "@nivo/sankey";

class SankeyGraph extends React.Component {

    state = {
        data: null,
    };

    /**
     * clean graph data:
     * - remove consecutive duplicate asns
     * - detect, warn, and remove cycles from graph
     *
     * @param path_lst list of as paths
     * @returns {[]} cleaned-up list of paths
     */
    clean_graph(path_lst){
        let downstream = {};
        let new_path_lst = [];
        path_lst.forEach(function (asns) {
            let newpath = [];
            asns = asns.filter(item => item!==undefined);
            for (let i = 0; i < asns.length - 1; i++) {
                if (asns[i] === asns[i + 1]) {
                    continue
                }
                newpath.push(asns[i])
            }
            if(!(asns[asns.length-1] in newpath)){
                newpath.push(asns[asns.length-1])
            }

            let has_cycle = false;
            for (let i = 0; i < newpath.length - 1; i++) {
                if(!(newpath[i] in downstream)){
                    downstream[newpath[i]] = new Set()
                }
                for (let j = i+1; j < newpath.length ; j++) {
                    if(newpath[j] in downstream && downstream[newpath[j]].has(newpath[i])){
                        console.log(`cycle found in ${newpath} ${newpath[j]} ${newpath[i]}`);
                        has_cycle = true;
                        break
                    }
                    downstream[newpath[i]].add(newpath[j])
                }
                if(has_cycle){
                    break
                }
            }
            if(!has_cycle){
                new_path_lst.push(newpath)
            }
        });

        return new_path_lst;
    }

    /**
     * convert list of paths, each is a list of asn, into a json object for nivo sankey
     * @param data
     */
    prepareDataJson(data) {
        let paths = this.clean_graph(data);

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
    }

    loadData(data) {
        this.setState({
            data: this.prepareDataJson(data),
        });
    }

    render() {
        if ("data" in this.props) {
            // allow loading data directly from props
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
