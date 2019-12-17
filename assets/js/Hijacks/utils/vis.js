/**
 * clean graph data:
 * - remove consecutive duplicate asns
 * - detect, warn, and remove cycles from graph
 *
 * @param path_lst list of as paths
 * @returns {[]} cleaned-up list of paths
 */
function clean_graph(path_lst){
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

export {clean_graph};
