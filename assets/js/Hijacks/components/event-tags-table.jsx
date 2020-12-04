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

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'Hijacks/css/hijacks.css';
import React from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const tags_columns = [
    {
        name: 'Tag Name',
        grow: 1,
        cell: row => {
            return (row.name);
        },
    },
    {
        name: 'Tag Definition',
        grow: 1,
        cell: row => {
            return (row.definition);
        },
    }
];

const codes_columns = [
    {
        name: 'Code Name',
        grow: 1,
        cell: row => {
            return (row.name);
        },
    },
    {
        name: 'definition',
        grow: 1,
        cell: row => {
            return (row.definition);
        },
    },
    {
        name: 'Applies To',
        grow: 1,
        cell: row => {
            let applies_to = ["all"];
            if(row.apply_to.length>0){
                applies_to = row.apply_to;
            }
            return (applies_to);
        },
    }
];

class EventTagsTable extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            codes: [],
            loading: true,
        };
    }

    componentDidMount() {
        this._loadTagsData();
    }

    _loadTagsData = async () => {
        let url = `https://bgp.caida.org/json/tags`;
        const response = await axios.get(url);
        let data = response.data;

        let tags = [];
        let codes = [];
        for(let tag_name in data['definitions']){
            tags.push({
                "name": tag_name,
                "definition": data['definitions'][tag_name]['definition']
            })
        }
        for(let tag_name in data['event_codes']){
            codes.push({
                "name": tag_name,
                "definition": data['event_codes'][tag_name]['definition'],
                "apply_to": data['event_codes'][tag_name]['apply_to'],
            })
        }

        this.setState({
            tags: tags,
            codes: codes,
            loading: false,
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className='row'>
                    <DataTable
                        title="Event Tags"
                        columns={tags_columns}
                        striped={true}
                        pointerOnHover={false}
                        highlightOnHover={true}
                        data={this.state.tags}
                        progressPending={this.state.loading}
                        fixedHeader={true}
                    />
                </div>

                <div className='row'>
                    <DataTable
                        title="Event Codes"
                        columns={codes_columns}
                        striped={true}
                        pointerOnHover={false}
                        highlightOnHover={true}
                        data={this.state.codes}
                        progressPending={this.state.loading}
                        fixedHeader={true}
                    />

                </div>
            </React.Fragment>
        );
    }
}

export default EventTagsTable;