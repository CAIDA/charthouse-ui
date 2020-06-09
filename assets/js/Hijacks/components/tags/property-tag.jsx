import * as React from "react";
import PropTypes from "prop-types";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Link from "react-router-dom/Link";
import {convertTagName} from "../../utils/tags";
import axios from "axios";

class PropertyTag extends React.Component{

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
            case "benign":
            case "no":
                res = "success";
                break;
            case "grey":
            case "na":
            case "unknown":
                res = "default";
                break;
            default:
                break;
        }
        return res;
    }

    render() {
        let name = convertTagName(this.props.name);
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
            <span className={`label label-${type} tag-label`}>
                <i className="tag-icon fa fa-info-circle" aria-hidden="true"/>
                {name}
            </span>
                </OverlayTrigger>
            </Link>
        )
    }
}


/**
 * Render a list of tags from a event or a prefix event.
 *
 * This component is responsible for both loading tags information from remote, and render tag combinations
 * based on their nature.
 */
class PropertyTagsList extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            tagDefinitions: {},
        };
    }

    componentDidMount() {
        this._loadTagsData()
    }

    _loadTagsData = async () => {
        const response = await axios.get("https://bgp.caida.org/json/tags");
        let definitions = response.data.definitions;
        this.setState({
            tagDefinitions: definitions,
        })
    };

    handleClick = (e) => {
        if(e.target.className==="tags-list" && this.props.enableClick){
            // if clicking on the empty area of the TagsList
            window.open(this.props.url, "_self");
        }
    };

    render() {
        let tags = this.props.tags;
        let tagDefinitions = this.state.tagDefinitions;

        return (
            <div className="tags-list" onClick={(e) => this.handleClick(e)}>
                {Object.keys(tags).map(function(tag_name, index){
                    let definition = "";
                    if(tag_name in tagDefinitions){
                        definition = tagDefinitions[tag_name].definition;
                    }
                    return <PropertyTag key={`tag-${tag_name}`}
                                        name={tag_name}
                                        type={tags[tag_name]}
                                        definition={definition}/>
                })}
            </div>
        )
    }
}

export {PropertyTag, PropertyTagsList};