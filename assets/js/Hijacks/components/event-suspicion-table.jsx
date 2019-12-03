import React from "react";
import TagsList from "./tags-list";
import DataTable from "react-data-table-component";
import {suspicion_level_to_type} from "../utils/tags";

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
                    'type': suspicion_level_to_type(row.suspicion_level)
                }
            }

            return <TagsList tags={tag_dict} />
        }
    },
    {
        name: 'Suspicion Level',
        selector: 'suspicion_level',
    },
    {
        name: 'Confidence',
        selector: 'confidence',
    },
    {
        name: 'Comments',
        selector: 'comments',
    },
];


/**
 * This component takes Inference result from event dictionary and visualize with a table
 */
class EventSuspicionTable extends React.Component {

    render() {
        let data = this.props.suspicion_tags;
        let used_tags = new Set();
        data.forEach((info)=>{
            info.tags.forEach((tag)=>{used_tags.add(tag)})
        });
        let unknown_tags = new Set();
        this.props.all_tags.forEach((tag)=>{
            if(!(used_tags.has(tag))){
                unknown_tags.add(tag)
            }
        });
        data.push({
            tags: unknown_tags,
            suspicion_level: "na",
            confidence: "na",
            comments: "Unknown nature"
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

export default EventSuspicionTable;
