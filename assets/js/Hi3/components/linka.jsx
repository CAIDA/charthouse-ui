import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import isExternal from 'is-url-external';

class LinkA extends React.Component {

    static propTypes = {
        to: PropTypes.string.isRequired,
        new_page: PropTypes.bool,
    };

    render() {
        let target="_self";
        if(this.props.new_page){
            target="_blank";
        }
        return isExternal(this.props.to) ?
            <a
                href={this.props.to}
                target={target}
                {...this.props}
            />
            :
            <Link {...this.props} />;
    }
}

export default LinkA;
