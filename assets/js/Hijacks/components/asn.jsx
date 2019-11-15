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

    tooltip(asorg, is_private){
        let res = <p>AS Info Unavailable</p>;
        if(is_private){
            res = <p>Private AS Number</p>;
        } else if(asorg){
            if("org" in asorg && "name" in asorg["org"]){
                // the `if` statement makes sure the data exists before refer to it
                asorg["org"]["name"] = asorg["org"]["name"].replace(/"/g, "");
                res = <React.Fragment>
                    <p> ASN: {asorg["id"]} </p>
                    <p> Name: {asorg["org"]["name"]} </p>
                    <p> Country: {asorg["country_name"]} </p>
                    <p> Rank: {asorg["rank"]} </p>
                </React.Fragment>
            }
        }
        return res
    }

    render() {
        let data = this.props.data;
        let asn = parseInt(this.props.asn);
        let is_private = (asn>=64512 && asn<=65534) || (asn>=4200000000 && asn<=4294967294);

        let country_flag = "";
        let as_name = "";
        let tooltip_str = this.tooltip(this.props.data, is_private);
        // TODO: consider loading data from asrank api if this.props.data is not available
        if(data){
            if(data.country){
                country_flag = this.flag(data.country);
            }
            if(data.name){
                as_name = this.abbrFit(data.name,22);
            }
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
                <span className={`as-country-${asn}`} style={{whiteSpace: "nowrap"}}> {country_flag}</span>
                AS{asn} {as_name}
                {is_private &&
                    <span className="badge badge-info">private</span>
                }
            </span>
            </OverlayTrigger>
        )
    }
}

export default AsNumber;