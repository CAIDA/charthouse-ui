import PropTypes from 'prop-types';
import React from 'react';
import CharthouseData from '../utils/dataset';

class RawText extends React.Component {
    static propTypes = {
        data: PropTypes.instanceOf(CharthouseData.api).isRequired
    };

    render() {
        return <pre style={{maxHeight: window.innerHeight * .8}}>
                <code>
                {JSON.stringify(this.props.data.data(), null, '  ')}
                </code>
            </pre>;
    }
}

export default RawText;
