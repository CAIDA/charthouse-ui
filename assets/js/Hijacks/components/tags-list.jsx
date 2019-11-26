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
        tagDefinitions: {},
    };

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this._loadTagsData()
    }

    _loadTagsData = async () => {
        const response = await axios.get("https://bgp.caida.org/json/tags");
        this.setState({
            tagDefinitions: response.data.definitions,
        })
    };

    render() {
        let tags = this.props.tags;
        let tagDefinitions = this.state.tagDefinitions;
        return (
            <div className={"tag-list"}>
                {Object.keys(tags).map(function(tag_name, index){
                    let definition = "";
                    if(tag_name in tagDefinitions){
                        definition = tagDefinitions[tag_name].definition;
                    }
                    return <Tag key={`tag-${tag_name}`}
                                name={tag_name}
                                type={tags[tag_name]["type"]}
                                definition={definition}/>
                })}
            </div>
        )
    }
}

export default TagsList;
