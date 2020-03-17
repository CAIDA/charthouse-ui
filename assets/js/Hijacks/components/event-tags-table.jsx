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

        console.log(data);

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