import PropTypes from 'prop-types';
import React from 'react';
import RBootstrap from 'react-bootstrap';

const Dialog = React.createClass({

    propTypes: {
        title: PropTypes.node,
        openOnInit: PropTypes.bool,
        backdrop: PropTypes.any,
        keyboard: PropTypes.bool,
        showCloseButton: PropTypes.bool,
        onClose: PropTypes.func,
        dialogClassName: PropTypes.string
    },

    getDefaultProps: function () {
        return {
            title: '',
            openOnInit: true,
            showCloseButton: false,
            onClose: function () {
            }
        };
    },

    getInitialState: function () {
        return {
            isOpen: this.props.openOnInit
        };
    },

    render: function () {
        return (
            <RBootstrap.Modal
                dialogClassName={"charthouse-dialog " + (this.props.dialogClassName || "")}

                show={this.state.isOpen}
                onHide={this.close}

                backdrop={this.props.backdrop}     // Darkens background
                keyboard={this.props.keyboard}     // Closes on esc keypress
                animation={true}    // Rendering animation
                closeButton={this.props.showCloseButton}  // cross button on top-right
            >
                <RBootstrap.Modal.Header>
                    <RBootstrap.Modal.Title>
                        {this.props.title}
                    </RBootstrap.Modal.Title>
                </RBootstrap.Modal.Header>
                <RBootstrap.Modal.Body>
                    {this.props.children}
                </RBootstrap.Modal.Body>
            </RBootstrap.Modal>
        );
    },

    // Externally open
    open: function () {
        this.setState({isOpen: true});
    },

    // Externally close
    close: function () {
        this.setState({isOpen: false});

        var rThis = this;
        setTimeout(function () {
            // Allow time for closing effect
            rThis.props.onClose();
        }, 500);
    }
});

export default Dialog;
