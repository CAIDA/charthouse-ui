import React from 'react'
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

class LinkButton extends React.Component {

    static propTypes = {
        to: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            history,
            location,
            match,
            staticContext,
            to,
            onClick,
            ...rest
        } = this.props;
        return <Button
            {...rest}
            onClick={(event) => {
                onClick && onClick(event);
                history.push(to)
            }}
        />
    }
}

export default withRouter(LinkButton)
