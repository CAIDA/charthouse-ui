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
 * Translate suspicion level to types (e.g. suspicious, grey, benign, unknown)
 * @param suspicion_level
 */
function suspicion_level_to_type(suspicion_level){
    if(suspicion_level>=80){
        return "suspicious";
    } else if(suspicion_level>20){
        return "grey";
    } else if (suspicion_level>=0){
        return "benign";
    } else {
        return "unknown";
    }
}

function tr_to_type(tr_worthiness){
    if(tr_worthiness==="yes"){
        return "suspicious";
    } else if (tr_worthiness === "no"){
        return "benign";
    } else {
        return "unknown";
    }
}

function tr_str_to_value(tr_worthiness){
    if(tr_worthiness==="yes"){
        return 1;
    } else if (tr_worthiness === "no"){
        return 0;
    } else {
        return -1;
    }
}

function extract_tags_tr_worthiness(tags_data){
    if(tags_data===undefined || Object.keys(tags_data).length === 0){
        return {};
    }

    let tags_tr_worthy_dict = {};
    for(let combination of tags_data["tr_worthy"]){
        let worthy = combination["worthy"];
        for(let tag of combination["tags"]){
            if(!(tag in tags_tr_worthy_dict)){
                tags_tr_worthy_dict[tag] = worthy;
            }
        }
    }
    return tags_tr_worthy_dict;
}

/**
 * Convert tag name from "-" separated string to space separated uppercase words
 * @param name
 * @returns {string|*}
 */
function convertTagName(name){
    if(name===undefined){
        return "undefined"
    }
    return name.split("-").map(function(x){
        return x.charAt(0).toUpperCase() + x.slice(1);
    }).join(" ")
}


export {suspicion_level_to_type, extract_tags_tr_worthiness, tr_to_type, convertTagName}