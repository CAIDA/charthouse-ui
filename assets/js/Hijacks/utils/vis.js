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
