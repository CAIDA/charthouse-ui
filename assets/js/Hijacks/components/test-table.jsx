import React from 'react';
import MUIDataTable from "mui-datatables";

const columns = ["Name", "Company", "City", "State"];

const data = [
    ["Joe James", "Test Corp", "Yonkers", "NY"],
    ["John Walsh", "Test Corp", "Hartford", "CT"],
    ["Bob Herm", "Test Corp", "Tampa", "FL"],
    ["James Houston", "Test Corp", "Dallas", "TX"],
];

// https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-pagination/index.js

const options = {
    filterType: 'checkbox',
    count: 2,
};


class TestTable extends React.Component {
    render() {
        return (
            <MUIDataTable
                title={"Employee List"}
                data={data}
                columns={columns}
                options={options}
            />
        )
    }
}

export default TestTable;
