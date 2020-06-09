import * as React from "react";
import PropTypes from "prop-types";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {convertTagName} from "../../utils/tags";

class InferenceTag extends React.Component{

    static propTypes = {
        name: PropTypes.string,
        suspicion_level: PropTypes.number,
        explanation: PropTypes.string,
        render_level: PropTypes.bool,
        render_explanation: PropTypes.bool,
    };

    static defaultProps = {
        render_level: true,
        render_explanation: false,
    };

    _determine_label_type(){
        let level = this.props.suspicion_level;
        let res = ["default", "question-circle"];
        if(level >= 80) {
            res = ["danger", "thumbs-down"]
        }
        else if(level <= 20) {
            res = ["success", "thumbs-up"]
        }
        return res;
    }

    render() {
        let name = convertTagName(this.props.name);
        let type = this._determine_label_type()
        return (
            <div>
                <OverlayTrigger
                    key={name}
                    placement={"top"}
                    overlay={
                        <Tooltip id={`tooltip-${name}`}>
                            {this.props.explanation}
                        </Tooltip>
                    }
                >
                <span className={`label tag-label label-${type[0]}`}>
                    <i className={`tag-icon fa fa-lightbulb-o`} aria-hidden="true"/>
                    {/*💡*/}
                    {name}
                    {this.props.render_level && ` (${this.props.suspicion_level})` }
                </span>
                </OverlayTrigger>
                {this.props.render_explanation &&
                    <p><i>{this.props.explanation}</i></p>
                }

            </div>
        )
    }
}


/**
 * Render a list of tags from a event or a prefix event.
 *
 * This component is responsible for both loading tags information from remote, and render tag combinations
 * based on their nature.
 */
class InferenceTagsList extends React.Component {
    static propTypes = {
        render_level: PropTypes.bool,
        render_explanation: PropTypes.bool,
    };

    static defaultProps = {
        render_level: true,
        render_explanation: false,
    };

    render() {
        return (
            <div className="inferences-list">
                {this.props.inferences.map(function(inference){
                    return <InferenceTag key={`inference-${inference.inference_id}`}
                                         name={inference.inference_id}
                                         suspicion_level={inference.suspicion_level}
                                         explanation={inference.explanation}
                                         render_level={this.props.render_level}
                                         render_explanation={this.props.render_explanation}
                    />
                }.bind(this))}
            </div>
        )
    }
}

export {InferenceTag, InferenceTagsList};