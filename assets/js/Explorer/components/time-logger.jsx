import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

const TimeLogger = React.createClass({

    const: {
        MOMENT_FORMAT: 'LL h:mma'
    },

    propTypes: {
        start: PropTypes.number,
        end: PropTypes.number
    },

    render: function () {
        return <span>
                <em className="text-primary">
                    {this.props.start ? moment(this.props.start).utc().format(this.const.MOMENT_FORMAT) : null}
                </em>
            &nbsp;-&nbsp;
            <em className="text-primary">
                    {this.props.end ? moment(this.props.end).utc().format(this.const.MOMENT_FORMAT) : null}
                </em>
            </span>;
    }
});

export default TimeLogger;
