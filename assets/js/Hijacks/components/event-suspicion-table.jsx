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

            return <PropertyTagsList tags={tag_dict} />;
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
        cell: row => {
            if(row.comments === undefined || row.comments.length === 0){
                return "";
            } else {
                return row.comments.map(comment => <p key={comment}>{comment}</p>);
            }
        }
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
            comments: ["Unknown nature"]
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
