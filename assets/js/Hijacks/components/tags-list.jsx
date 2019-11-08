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
        data: null
    };

    constructor(props){
        super(props)
        this._loadTagsData()
    }

    async _loadTagsData(){
        const response = await axios.get("https://bgp.caida.org/json/tags");
        console.log(response.data)
    }

    render() {
        let tags = this.props.tags;
        if(this.state.data === null){
            // no external data available, render raw tags
            return (
                <div className={"tag-list"}>
                    {tags.map(function(tag){
                        tag = tag.key;
                        return <Tag key={`tag-${tag}`} name={tag}/>
                    })}
                </div>
            )
        }
    }
}

export default TagsList;
