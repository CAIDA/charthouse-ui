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

        console.log(tags);
        return (
            <div className="tags-list" onClick={(e) => this.handleClick(e)}>
                {Object.keys(tags).map(function(tag_name, index){
                    let definition = "";
                    if(tag_name in tagDefinitions){
                        definition = tagDefinitions[tag_name].definition;
                    }
                    return <Tag key={`tag-${tag_name}`}
                                name={tag_name}
                                type={tags[tag_name]}
                                definition={definition}/>
                })}
            </div>
        )
    }
}

export default TagsList;
