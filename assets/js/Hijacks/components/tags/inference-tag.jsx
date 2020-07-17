/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

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