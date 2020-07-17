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
