import * as React from "react";

class IPPrefix extends React.Component {

    render() {
        let prefix = this.props.prefix;
        return(
            <span className="ipprefix__span">
                <a key={prefix} href={`https://stat.ripe.net/${prefix}#tabId=routing`} target="_blank">
                    {prefix}
                </a>
            </span>
        )
    }
}

export default IPPrefix;