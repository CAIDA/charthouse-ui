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