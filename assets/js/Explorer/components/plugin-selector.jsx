import PropTypes from 'prop-types';
import React from 'react';
import $ from 'jquery';

import CHARTHOUSE_PLUGIN_SPECS from '../config/plugin-specs';
import '../utils/proto-mods';

class PluginSelector extends React.Component {
    static propTypes = {
        selectedPlugin: PropTypes.string,
        onPluginSelected: PropTypes.func,
        height: PropTypes.string
    };

    static defaultProps = {
        selectedPlugin: null,
        onPluginSelected: null
    };

    _handleChange = (event) => {
        if (this.props.onPluginSelected) {
            this.props.onPluginSelected(event.target.value);
        }
    };

    render() {

        return <select
            value={this.props.selectedPlugin}
            className="form-control input-sm"
            onChange={this._handleChange}
            style={
                $.extend({cursor: 'pointer'},
                    this.props.height ? {height: this.props.height} : {}
                )
            }
        >
            {
                Object.keys(CHARTHOUSE_PLUGIN_SPECS).filter(function (p) {
                    return !CHARTHOUSE_PLUGIN_SPECS[p].hasOwnProperty('internal') || !CHARTHOUSE_PLUGIN_SPECS[p].internal;
                }).sort(function (a, b) {
                    return CHARTHOUSE_PLUGIN_SPECS[a].title.alphanumCompare(CHARTHOUSE_PLUGIN_SPECS[b].title)
                }).map(function (pluginId) {
                    return <option
                        key={pluginId}
                        value={pluginId}
                        title={CHARTHOUSE_PLUGIN_SPECS[pluginId].description}
                    >
                        {CHARTHOUSE_PLUGIN_SPECS[pluginId].title}
                    </option>
                })
            }

        </select>
    }
}

export default PluginSelector;
