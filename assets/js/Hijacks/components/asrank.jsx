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
import axios from "axios";

/**
 * AS Rank block for display
 */
class AsRank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            asrank: ""
        }
    }

    componentDidMount() {
        this._loadData()
    }

    _loadData = async () => {

        /*
        let query = `{"query": asn(asn:"${this.props.asn}") {
    asn,
    asnName,
    source,
    country{
      name,
      iso
    }
  }
}`;
*/
        let q1 = JSON.stringify(
            `
            {
  asn(asn:"${this.props.asn}"){
    country {
      iso
      name
      capital
      population
      continent
      area
    }
  }
}`
        );
        let query = {"query":`{\n  asn(asn:\"${this.props.asn}\"){asn\n \n    country {\n      iso\n      name\n      capital\n      population\n      continent\n      area\n    }\n  }\n}`};
        //let query = {"query":q1};

        const res = await axios.post("https://api.asrank.caida.org/v2/graphql",
            query
        );
        console.log(res);
        this.setState({
            asrank: JSON.stringify(res['data']['data'], null, '\n')
        })
    };

    render(){
        if(this.state.asrank!==""){
            return(
                <code>
                    {this.state.asrank}
                </code>
            )
        } else {
            return(
                <div>
                    {this.props.asn}
                </div>
            )
        }
    }
}

export default AsRank;