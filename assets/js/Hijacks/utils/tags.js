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
    if(tags_data===undefined){
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