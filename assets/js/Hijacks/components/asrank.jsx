import * as React from "react";
import gql from "apollo-boost";
import ApolloClient from 'apollo-boost';
import useQuery from "@apollo/react-hooks";

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
        let query = gql`
        {
  query: asn(asn:"${this.props.asn}") {
    asn,
    asnName,
    source,
    country{
      name,
      iso
    }
  }
}`;
        let client = new ApolloClient({
            uri: 'https://api.asrank.caida.org/v2/graphql',
        });
        client.query(query).then(result => console.log(result));
    };

    render(){
        if(this.state.asrank!==""){
            return(
                <div>
                    {this.state.asrank}
                </div>
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