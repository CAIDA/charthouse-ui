function _extract_prefixes(pfx_events) {
    let prefixes = [];
    for (let pfx_event of pfx_events) {
        if ("prefix" in pfx_event) {
            prefixes.push(pfx_event["prefix"])
        }
        if ("sub_pfx" in pfx_event) {
            prefixes.push(pfx_event["sub_pfx"])
        }
    }
    return prefixes
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0')
}

function extract_largest_prefix(event) {
    if (!('pfx_events' in event)) {
        return ""
    }
    let prefixes = _extract_prefixes(event["pfx_events"]);
    let largest_pfx_len = 1000;
    let largest_pfx = "";
    for (let p of prefixes) {
        let len = parseInt(p.split("/")[1]);
        if (len <= largest_pfx_len) {
            largest_pfx = p;
            largest_pfx_len = len;
        }
    }
    return largest_pfx;
}

function extract_impact(event) {
    if (!('pfx_events' in event)) {
        return ""
    }
    let prefixes = _extract_prefixes(event["pfx_events"]);
    let num_pfx = 0;
    let num_addrs = 0;
    for (let p of prefixes) {
        num_pfx++;
        let len = parseInt(p.split("/")[1]);
        if (len <= 32) {
            num_addrs += Math.pow(2, 32 - len);
        } else {
            num_addrs += Math.pow(2, 128 - len);
        }
    }
    if (num_addrs.toString().length > 10) {
        num_addrs = num_addrs.toPrecision(2)
    }

    let impact_str = "";
    if (num_pfx === 1) {
        impact_str += `${num_pfx} pfx `
    } else {
        impact_str += `${num_pfx} pfxs `
    }
    if (num_addrs === 1) {
        impact_str += `(${num_addrs} addr)`
    } else {
        impact_str += `(${num_addrs} addrs)`
    }
    return impact_str
}

function unix_time_to_str(unix_time) {
    let d = new Date(unix_time * 1000);
    let year = d.getUTCFullYear();
    let month = zeroPad(d.getUTCMonth() + 1, 2);
    let day = zeroPad(d.getUTCDate(), 2);
    let hour = zeroPad(d.getUTCHours(), 2);
    let minute = zeroPad(d.getUTCMinutes(), 2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

function extract_prefixes(pfx_event) {
    let prefixes = [];
    if ("prefix" in pfx_event) {
        prefixes.push(pfx_event.prefix);
    }
    if ("sub_pfx" in pfx_event) {
        prefixes.push(pfx_event.sub_pfx);
    }
    if ("super_pfx" in pfx_event) {
        prefixes.push(pfx_event.super_pfx);
    }
    return prefixes
}

function translate_suspicion_str_to_values(suspicionLevel) {
    let min_susp = 0;
    let max_susp = 100;
    if (suspicionLevel === "suspicious") {
        min_susp = 80;
    } else if (suspicionLevel === "benign") {
        max_susp = 20;
    } else if (suspicionLevel === "grey") {
        max_susp = 79;
        min_susp = 21;
    } else if (suspicionLevel === "all") {
        // nothing to do here
    }
    return [min_susp, max_susp]
}

function translate_suspicion_values_to_str(min_susp, max_susp) {
    if(min_susp===80 && max_susp===100){
        return "suspicious"
    } else if (min_susp==0 && max_susp==20){
        return "benign"
    } else if (min_susp===21 && max_susp===79){
        return "grey"
    } else {
        return "all"
    }
}

export {extract_impact, extract_largest_prefix, unix_time_to_str, extract_prefixes,
    translate_suspicion_str_to_values, translate_suspicion_values_to_str
}
