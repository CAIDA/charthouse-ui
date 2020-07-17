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

import React from 'react';

class EventSearchBox extends React.Component {

    constructor(props){
        super(props);
        this.textInput = React.createRef();
    }

    _handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this._handleSearch()
        }
    };

    RE_PFX = /^!?[0-9]+[.:][0-9.:/]*$/;
    RE_TAG = /^!?[a-zA-Z\-]+$/;
    RE_CODE = /^!?code:[a-zA-Z\-]+$/;
    RE_ASN = /^!?(AS|as)?[0-9]+$/;

    _parseSearchInput = (search_text) => {
        let fields = search_text.trim().split(" ");

        let prefixes = [];
        let tags = [];
        let codes = [];
        let asns = [];


        let ready = false;
        for(let v of fields){
            v = v.trim().toLowerCase();
            if(this.RE_PFX.test(v)){
                // if this is a prefix
                prefixes.push(v);
                ready = true;
            }

            // check if it's a tag
            if(this.RE_TAG.test(v)){
                tags.push(v);
                ready = true;
            }

            // check if it's a code
            if(this.RE_CODE.test(v)){
                codes.push(v.split(":")[1]);
                ready = true;
            }

            // check if it's an as number
            if(this.RE_ASN.test(v)){
                v = v.replace(/as/i,"");
                asns.push(v);
                ready = true;
            }
        }
        return [prefixes, tags, codes, asns];
    };

    _handleSearch = () => {
        let search_text = this.textInput.current.value;
        let [prefixes, tags, codes, asns] = this._parseSearchInput(search_text);
        this.props.onSearch({pfxs: prefixes, asns: asns, tags:tags, codes: codes});
    };

    _queryToString = () => {
        let res =  [
            this.props.pfxs.join(" "),
            this.props.tags.join(" "),
            this.props.codes.map(code=>"code:"+code).join(" "),
            this.props.asns.map(asn=> "AS"+asn).join(" ")
        ].join(" ").trim();
        return res;
    };

    render() {
        return (
            <div className="input-group col-lg-3 search-bar__component">
                <label className="search-bar__label">
                    Search for events by prefix/ASN/tags
                </label>
                <input type="text"
                       className="form-control search-bar__search-input"
                       placeholder="Search by prefix/ASN/tags"
                       ref={this.textInput}
                       onKeyPress={this._handleKeyPress}
                       defaultValue={this._queryToString()}
                />
                <button className="btn btn-success" type="button" onClick={this._handleSearch}>Search</button>
            </div>
        )
    }
}

export default EventSearchBox;
