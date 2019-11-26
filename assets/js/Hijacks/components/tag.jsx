import * as React from "react";
import PropTypes from "prop-types";

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
        let res = "warning";

        switch(type){
            case "na":
                res = "default";
                break;
            case "no":
                res = "success";
                break;
            case "yes":
                res = "danger";
                break;
            default:
                break
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
        return (
            <span className={`label tag-label label-${type}`}>
                {name}
            </span>
        )
    }
}

export default Tag;