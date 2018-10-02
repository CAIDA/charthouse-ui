import React from 'react';
import RBootstrap from 'react-bootstrap';

const RadioToolbar = React.createClass({

    propTypes: {
        options: React.PropTypes.arrayOf(React.PropTypes.object),    // Each { val: [string], display: [React component] }
        selected: React.PropTypes.string,
        fontSize: React.PropTypes.string,
        description: React.PropTypes.string,
        onChange: React.PropTypes.func
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
