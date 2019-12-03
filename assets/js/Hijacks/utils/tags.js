/**
 * Translate suspicion level to types (e.g. suspicious, grey, benign, unknown)
 * @param suspicion_level
 */
function suspicion_level_to_type(suspicion_level){
    if(suspicion_level>=80){
        return "suspicious"
    } else if(suspicion_level>20){
        return "grey"
    } else if (suspicion_level>=0){
        return "benign"
    } else {
        return "unknown"
    }
}

function tr_to_type(tr_worthiness){
    if(tr_worthiness==="yes"){
        return "suspicious"
    } else if (tr_worthiness === "no"){
        return "benign"
    } else {
        return "unknown"
    }
}

function tr_str_to_value(tr_worthiness){
    if(tr_worthiness==="yes"){
        return 1
    } else if (tr_worthiness === "no"){
        return 0
    } else {
        return -1
    }
}

function extract_tags_dict_from_inference(inference){
    if(inference===undefined){
        return {}
    }
    let tags_dict = {};
    let tags_dict_tmp = {};
    for(let tag_comb_info of inference.suspicion.suspicion_tags){
        for(let tag of tag_comb_info.tags){
            if(tag in tags_dict_tmp){
                if(tags_dict_tmp[tag].confidence>tag_comb_info.confidence){
                    tags_dict_tmp[tag]={
                        "level": tag_comb_info.suspicion_level,
                        "confidence": tag_comb_info.confidence,
                    }
                }
            } else {
                tags_dict_tmp[tag]={
                    "level": tag_comb_info.suspicion_level,
                    "confidence": tag_comb_info.confidence,
                }
            }
        }
    }

    for(let tag_name of Object.keys(tags_dict_tmp)){
        let tag_info = tags_dict_tmp[tag_name];
        tags_dict[tag_name] = {
            "type": suspicion_level_to_type(tag_info.level)
        }
    }

    return tags_dict
}

export {suspicion_level_to_type, extract_tags_dict_from_inference, tr_to_type}