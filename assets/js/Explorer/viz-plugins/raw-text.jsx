import PropTypes from 'prop-types';
import React from 'react';
import CharthouseData from '../utils/dataset';

const RawText = React.createClass({

    propTypes: {
        data: PropTypes.instanceOf(CharthouseData.api).isRequired
    },

    render: function () {
        return <pre style={{maxHeight: window.innerHeight * .8}}>
                <code>
                {JSON.stringify(this.props.data.data(), null, '  ')}
                </code>
            </pre>;
    }

});

export default RawText;
