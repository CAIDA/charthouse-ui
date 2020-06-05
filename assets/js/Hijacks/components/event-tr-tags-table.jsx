import React from "react";
import {PropertyTagsList} from "./tags/property-tag";
import DataTable from "react-data-table-component";
import {tr_to_type} from "../utils/tags";

const columns = [
    {
        name: 'Tags',
        selector: 'tags',
        wrap: true,
        grow:3,
        cell: row => {
            let tag_dict={};
            for(let tag of row.tags){
                tag_dict[tag]= {
                    'type': tr_to_type(row.worthy)
                }
            }
            return <PropertyTagsList tags={tag_dict} />
        }
    },
    {
        name: 'Traceroute Worthy',
        selector: 'worthy',
    },
    {
        name: 'Comments',
        selector: 'explain',
    },
];


/**
 * This component takes Inference result from event dictionary and visualize with a table
 */
class EventTrTagsTable extends React.Component {

    _preprocess_tags(event_tags, all_tags){
        let tags_array = [];
        for(let tag_comb_info of all_tags.tr_worthy){
            if(tag_comb_info.worthy==="na"){
                continue
            }
            let tags = tag_comb_info.tags;
            if( tags.every((tag)=>{return event_tags.includes(tag)})){
                // if all tags are present in this event
                tags_array.push({
                    "tags": tags,
                    "worthy": tag_comb_info.worthy,
                })
            }
        }
        return tags_array
    }

    render() {

        let data = this._preprocess_tags(this.props.eventTags, this.props.allTags);

        let used_tags = new Set();
        data.forEach((info)=>{
            info.tags.forEach((tag)=>{used_tags.add(tag)})
        });
        let unknown_tags = new Set();
        this.props.eventTags.forEach((tag)=>{
            if(!(used_tags.has(tag))){
                unknown_tags.add(tag)
            }
        });

        data.push({
            tags: unknown_tags,
            worthy: "unknown",
            explain: "Unknown nature"
        });

        return (
            <React.Fragment>
            <DataTable
                columns={columns}
                title={this.props.title}
                striped={true}
                highlightOnHover={true}
                data={data}
                pagination={false}
            />
            </React.Fragment>
    );
    }
}

export default EventTrTagsTable;
