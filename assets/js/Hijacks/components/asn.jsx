import * as React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";


class AsNumber extends React.Component {

    abbrFit(string, nChars, divPos, sep) {
        // The relative position where to place the '...'
        divPos = divPos || 0.7;
        sep = sep || '...';
        if (nChars<=sep.length) {
            // If string is smaller than separator
            sep='';
        }

        nChars-=sep.length;

        if (string.length<=nChars) return ""+string;

        return string.substring(0,nChars*divPos)
            + sep
            + string.substring(string.length - nChars*(1-divPos), string.length);
    }

    flag(country_code) {
        const OFFSET = 127397;
        // only allow string input
        if (typeof country_code !== 'string'){
            // throw new TypeError('argument must be a string');
            return "";
        }
        // ensure country code is all caps
        const cc = country_code.toUpperCase();
        // return the emoji flag corresponding to country_code or null
        return (/^[A-Z]{2}$/.test(cc))
            ? String.fromCodePoint(...[...cc].map(c => c.charCodeAt() + OFFSET))
            : null;
    }

    tooltip(asn, external, is_private, on_blacklist, on_asndrop){
        // let res = <p>AS Info Unavailable</p>;
        let res = [];
        let count=0;
        if(is_private){
            res.push(<p key={`tooltip-${count++}`}>Private AS Number</p>);
        }
        if(on_blacklist){
            res.push(<p key={`tooltip-${count++}`}>AS is on a blacklist</p>)
        }
        if(on_asndrop){
            res.push(<p key={`tooltip-${count++}`}>AS is on Spamhaus ASN DROP list</p>)
        }
        if ("asrank" in external && asn in external.asrank) {
            let asorg = external.asrank[asn];
            if ("org" in asorg && "name" in asorg["org"]) {
                asorg["org"]["name"] = asorg["org"]["name"].replace(/"/g, "");
                res.push(<p key={`tooltip-${count++}`}> ASN: {asorg["id"]} </p>);
                res.push(<p key={`tooltip-${count++}`}> Name: {asorg["org"]["name"]} </p>);
                res.push(<p key={`tooltip-${count++}`}> Country: {asorg["country_name"]} </p>);
                res.push(<p key={`tooltip-${count++}`}> Rank: {asorg["rank"]} </p>);
            }
        }
        if ("hegemony" in external && asn in external.asrank) {
            res.push(<p key={`tooltip-${count++}`}> Hegemony: {external.hegemony[asn]} </p>);
        }
        if(res.length===0){
            res.push(<p key={`tooltip-${count++}`}>AS Info Unavailable</p>);
        }
        return (
            <>
                {res}
            </>
        );
    }

    render() {
        let data = this.props.data;
        let asn = parseInt(this.props.asn);

        // check blacklist and private asn
        let on_blacklist = false;
        let on_asndrop = false;
        if(data.blacklist && data.blacklist.includes(asn)){ on_blacklist = true; }
        if(data.asndrop && data.asndrop.includes(asn)){ on_asndrop = true; }
        let is_private = (asn>=64512 && asn<=65534) || (asn>=4200000000 && asn<=4294967294);

        // construct tooltip
        let tooltip_str = this.tooltip(asn, data, is_private, on_blacklist, on_asndrop);

        // TODO: consider loading data from asrank api if this.props.data is not available
        // render country flag and org name
        let asorg = data.asrank[asn];
        let country_flag = "";
        let as_name = "";
        if(asorg){
            if(asorg.country){
                country_flag = this.flag(asorg.country);
            }
            if(asorg.name){
                as_name = this.abbrFit(asorg.name,22);
            }
        }

        let res;
        if(this.props.simple){
           res =  <React.Fragment>
                AS{asn}
            </React.Fragment>

        } else {
            res =
                <React.Fragment>
                    <span className="asn__country"> {country_flag}</span>
                    AS{asn} {as_name}
                    {is_private &&
                    <span className="badge badge-info">private</span>
                    }
                    {on_blacklist &&
                    <span className="badge badge-info">blacklist</span>
                    }
                    {on_asndrop &&
                    <span className="badge badge-info">asndrop</span>
                    }
                </React.Fragment>
        }

        return (
            <OverlayTrigger
                key={this.props.asn}
                placement={"top"}
                overlay={
                    <Tooltip id={`tooltip-${asn}`}>
                        {tooltip_str}
                    </Tooltip>
                }
            >
            <span>
                <a href={`https://asrank.caida.org/asns?asn=${asn}`} target="_blank">
                    {res}
                </a>
            </span>
            </OverlayTrigger>
        )
    }
}

export default AsNumber;