import React from 'react';
import axios from "axios";
import Tag from "./tag";

/**
 * Render a list of tags from a event or a prefix event.
 *
 * This component is responsible for both loading tags information from remote, and render tag combinations
 * based on their nature.
 */
class TagsList extends React.Component {

    state = {
        tagTypes: {},
        tagDefinitions: {},
    };

    constructor(props){
        super(props)
        this._loadTagsData = this._loadTagsData.bind(this)

    }

    componentDidMount() {
        this._loadTagsData()
    }

    async _loadTagsData(){
        const response = await axios.get("https://bgp.caida.org/json/tags");
        let definitions = {};
        let tags = Object.keys(response.data.definitions);
        let yes_tags = [];
        let no_tags=[];
        let na_tags=[];
        for(let combination of response.data.tr_worthy){
            if(combination.worthy==="no"){
                yes_tags = yes_tags.concat(combination.tags)
            } else if (combination.worthy === "yes"){
                no_tags = no_tags.concat(combination.tags)
            } else if (combination.worthy === "na"){
                na_tags = na_tags.concat(combination.tags)
            } else {
                console.log(`unknown worthiness ${combination.worthy} for tags ${combination.tags}`)
            }
        }
        yes_tags = yes_tags.filter(x => !no_tags.includes(x));
        let tagTypes = {}
        for(let tag of tags){
            if(tag in yes_tags){
                tagTypes[tag] = "yes"
            } else if(tag in no_tags){
                tagTypes[tag] = "no"
            } else if(tag in na_tags) {
                tagTypes[tag] = "na"
            } else {
                tagTypes[tag] = "na"
            }
        }

        this.setState({
            tagDefinitions: response.data.definitions,
            tagTypes: tagTypes,
        })
    }

    render() {
        let tags = this.props.tags;
        let tagTypes = this.state.tagTypes;
        let tagDefinitions = this.state.tagDefinitions;
        return (
            <div className={"tag-list"}>
                {tags.map(function(tag){
                    let type = "na";
                    let definition = "";
                    if(tag in tagTypes){
                        type = tagTypes[tag];
                    }
                    if(tag in tagDefinitions){
                        definition = tagDefinitions[tag].definition;
                    }
                    return <Tag key={`tag-${tag}`} name={tag} type={type} definition={definition}/>
                })}
            </div>
        )
    }
}

export default TagsList;
