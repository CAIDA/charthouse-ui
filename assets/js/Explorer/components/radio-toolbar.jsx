import PropTypes from 'prop-types';
import React from 'react';
import RBootstrap from 'react-bootstrap';

const RadioToolbar = React.createClass({

    propTypes: {
        options: PropTypes.arrayOf(PropTypes.object),    // Each { val: [string], display: [React component] }
        selected: PropTypes.string,
        fontSize: PropTypes.string,
        description: PropTypes.string,
        onChange: PropTypes.func
    },

    getDefaultProps: function () {
        return {
            options: [],
            description: '',
            fontSize: '13px',
            onChange: function (newVal) {
            }
        };
    },

    render: function () {
        const rThis = this;

        return <RBootstrap.ButtonGroup
            bsSize="xsmall"
            style={{verticalAlign: 'middle'}}
            title={this.props.description}
        >
            {this.props.options.map(function (option) {
                return <RBootstrap.Button
                    key={option.val}
                    active={rThis.props.selected === option.val}
                    onClick={function () {
                        rThis.props.onChange(option.val);
                    }}
                    style={{fontSize: rThis.props.fontSize}}
                >
                    {option.display}
                </RBootstrap.Button>;
            })}
        </RBootstrap.ButtonGroup>;
    }
});

export default RadioToolbar;
