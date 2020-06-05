/**
 * clean graph data:
 * - remove consecutive duplicate asns
 * - detect, warn, and remove cycles from graph
 *
 * @param path_lst list of as paths
 * @returns {[]} cleaned-up list of paths
 */
function clean_graph(path_lst){

    function find_cycle(to_check, compare_asn) {
        // recursively search for downstreams to find matching asns in downstream sets
        let found = false;
        for(let asn of to_check){
            if(asn === compare_asn){
                return true
            }
            if(asn in downstream){
                found = find_cycle(downstream[asn], compare_asn);
            }
            if(found){
                break
            }
        }
        return found
    }

    let downstream = {};
    let new_path_lst = [];
    path_lst.forEach(function (asns) {
        let newpath = [];

        // remove undefined nodes from path
        asns = asns.filter(item => item!==undefined);

        // remove continuously duplicate nodes
        for (let i = 0; i < asns.length - 1; i++) {
            if (asns[i] === asns[i + 1]) {
                continue
            }
            newpath.push(asns[i])
        }
        if(!newpath.includes(asns[asns.length-1])){
            newpath.push(asns[asns.length-1])
        }

        // locate cycles
        let has_cycle = false;
        for (let i = 0; i < newpath.length - 1; i++) {
            // from the first node to the second to last node
            let cur_asn = newpath[i];

            // create downstream cache for the current node if not exist
            if(!(newpath[i] in downstream)){
                downstream[newpath[i]] = new Set()
            }

            for (let j = i+1; j < newpath.length ; j++) {
                let next_asn = newpath[j];
                if(find_cycle([next_asn], cur_asn)){
                    console.log(`cycle found in ${newpath} ${newpath[j]} ${newpath[i]}, path removed`);
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

export {clean_graph};
