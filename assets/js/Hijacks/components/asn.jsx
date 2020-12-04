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

    tooltip(asn, asinfo, is_private, on_blacklist, on_asndrop){
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
        if (asinfo[asn] && asinfo[asn].asrank && asinfo[asn].asrank.organization && asinfo[asn].asrank.organization.country ) {
            let asorg = asinfo[asn].asrank;
            let country_name = asorg.organization.country.name;
            let org_name = asorg.organization.orgName;
            let rank = asorg.rank;
            if (org_name) {
                org_name = org_name.replace(/"/g, "");
                res.push(<p key={`tooltip-${count++}`}> ASN: {asn} </p>);
                res.push(<p key={`tooltip-${count++}`}> Name: {org_name} </p>);
                res.push(<p key={`tooltip-${count++}`}> Country: {country_name} </p>);
                res.push(<p key={`tooltip-${count++}`}> Rank: {rank} </p>);
            }
        }
        if ("hegemony" in asinfo && asn in asinfo.asrank) {
            res.push(<p key={`tooltip-${count++}`}> Hegemony: {asinfo.hegemony[asn]} </p>);
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
        let asorg = null;
        if(data[asn] && data[asn].asrank){
            asorg = data[asn].asrank;
        }
        let country_flag = "";
        let as_name = "";
        if(asorg && asorg.organization){
            let country_code = asorg.organization.country.iso;
            let org_name = asorg.organization.orgName;
            if(country_code){
                country_flag = this.flag(country_code);
            }
            if(org_name){
                as_name = this.abbrFit(org_name,22);
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
                    AS{asn} {as_name} {" "}
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