import React from "react";
import SkyLight from "react-skylight";

class ModalContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "test ModalContent"
        }
    }

    setContent(content){
        this.setState({
            content: content
        })
    }

    render(){
        return (
            <div>
                {this.state.content}
            </div>
        )
    }
}

class PopupModal extends React.Component {
    constructor(props) {
        super(props);
    }

    show(){
        this.modal.show()
    }

    setContent(content){
        this.modalContent.setContent(
            <div>
                <b>AS {content}</b>
            </div>
        )
    }

    render(){
        return(
            <SkyLight hideOnOverlayClicked ref={ref => this.modal = ref}>
                <ModalContent ref={ref => this.modalContent = ref}/>
            </SkyLight>
        )
    }
}

export default PopupModal

