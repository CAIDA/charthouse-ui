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
    RE_ASN = /^!?(AS|as)?[0-9]+$/;

    _parseSearchInput = (search_text) => {
        let fields = search_text.trim().split(" ");

        let prefixes = [];
        let tags = [];
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

            // check if it's an as number
            if(this.RE_ASN.test(v)){
                v = v.replace(/as/i,"");
                asns.push(v);
                ready = true;
            }
        }
        return [prefixes, tags, asns]
    };

    _handleSearch = () => {
        let search_text = this.textInput.current.value;
        let [prefixes, tags, asns] = this._parseSearchInput(search_text);
        console.log(asns);
        this.props.onSearch({pfxs: prefixes, asns: asns, tags:tags});
    };

    _queryToString = () => {
        let res =  [
            this.props.pfxs.join(" "),
            this.props.tags.join(" "),
            this.props.asns.map(asn=> "AS"+asn).join(" ")
        ].join(" ");
        console.log(res);
        return res
    };

    render() {
        return (
            <div className="input-group col-lg-3" style={{display: 'inline-block'}}>
                <label style={{display: 'block'}}>
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
