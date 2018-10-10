import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'react-bootstrap';

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
            <Modal
                dialogClassName={"charthouse-dialog " + (this.props.dialogClassName || "")}

                show={this.state.isOpen}
                onHide={this.close}

                backdrop={this.props.backdrop}     // Darkens background
                keyboard={this.props.keyboard}     // Closes on esc keypress
                animation={true}    // Rendering animation
                closeButton={this.props.showCloseButton}  // cross button on top-right
            >
                <Modal.Header>
                    <Modal.Title>
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
            </Modal>
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
