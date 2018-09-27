import React from 'react';
// TODO: jq-toggles

const ToggleSwitch = React.createClass({

    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        on: React.PropTypes.bool,
        textOn: React.PropTypes.string,
        textOff: React.PropTypes.string,
        description: React.PropTypes.string,
        onToggle: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            width: 43,
            height: 16,
            on: false,
            textOn: 'On',
            textOff: 'Off',
            description: '',
            onToggle: function (isOn) {
            }
        }
    },

    componentDidMount: function () {
        this.$toggle = $(this.refs.toggleBtn.getDOMNode()).toggles({
            width: this.props.width,
            height: this.props.height,
            on: this.props.on,
            drag: false,
            text: {
                on: this.props.textOn,
                off: this.props.textOff
            }
        });

        var rThis = this;
        this.$toggle.on('toggle', function (e, active) {
            rThis.props.onToggle(active);
        });
    },

    componentDidUpdate: function (prevProps) {
        if (this.props.on != prevProps.on)
            this.$toggle.toggles(this.props.on);
    },

    componentWillUnmount: function () {
        // Destroy plugin
        var $elem = $(this.refs.toggleBtn.getDOMNode());
        $.removeData($elem.get(0));
    },

    render: function () {
        return <div
            className="toggle-modern text-center"
            ref="toggleBtn"
            title={this.props.description}
            style={{WebkitFontSmoothing: 'antialiased'}}
        />
    }

});

export default ToggleSwitch;
