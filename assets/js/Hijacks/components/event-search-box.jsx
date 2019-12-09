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
        ].join(" ");
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
