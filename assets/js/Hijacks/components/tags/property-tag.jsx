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
import PropTypes from "prop-types";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Link from "react-router-dom/Link";
import {convertTagName} from "../../utils/tags";
import axios from "axios";
import {TAGS_URL} from "../../utils/endpoints";

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
                res = "warning";
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

        const url = new URL(window.location.href);
        let parts = url.pathname.split("/");
        let loc = parts.indexOf("events");
        let event_type = "all";
        if(loc>0){
            event_type = parts[loc+1];
        }
        let search_term = `?tags=${this.props.name}&min_susp=0&max_susp=100&event_type=${event_type}`;

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
        const response = await axios.get(TAGS_URL);
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