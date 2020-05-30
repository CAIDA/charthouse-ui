import * as React from "react";
import PropTypes from "prop-types";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Link from "react-router-dom/Link";

class Tag extends React.Component{

    static propTypes = {
        name: PropTypes.string,
        /**
         * type of the tag labels:
         * - default: na tag (grey)
         * - success: no tag (green)
         * - danger: yes tag (red)
         */
        type: PropTypes.string,
    };

    static defaultProps = {
        type: "na",
    };

    _translateType(type){
        let res = "default";

        switch(type){
            case "suspicious":
            case "yes":
                res = "danger";
                break;
            case "grey":
                res = "warning";
                break;
            case "benign":
            case "no":
                res = "success";
                break;
            case "unknown":
            case "na":
                res = "default";
                break;
            default:
                break;
        }
        return res;
    }

    _renderTagName(name){
        if(name===undefined){
            return "undefined"
        }
        return name.split("-").map(function(x){
            return x.charAt(0).toUpperCase() + x.slice(1);
        }).join(" ")
    }

    render() {
        let name = this._renderTagName(this.props.name);
        let type = this._translateType(this.props.type);
        let search_term = `?tags=${this.props.name}`;
        return (
            <Link to={{
                pathname:"/feeds/hijacks/events",
                search: `${search_term}` }}
                  replace={true}
                  target={"_blank"}
            >
                <OverlayTrigger
                    key={name}
                    placement={"top"}
                    overlay={
                        <Tooltip id={`tooltip-${name}`}>
                            {this.props.definition}
                        </Tooltip>
                    }
                >
            <span className={`label tag-label label-${type}`}>
                {name}
            </span>
                </OverlayTrigger>
            </Link>
        )
    }
}

export default Tag;