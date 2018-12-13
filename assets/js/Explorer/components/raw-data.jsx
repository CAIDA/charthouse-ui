import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import {CharthouseDataSet} from '../utils/dataset';
import CHARTHOUSE_PLUGIN_SPECS from '../viz-plugins/plugin-specs';
import PluginContent from './plugin-content';
import Dialog from './dialog';

class RawData extends React.Component {

    static propTypes = {
        data: PropTypes.instanceOf(CharthouseDataSet).isRequired
    };

    state = {
        fillRawData: false,   // Has the 'show data' container been populated yet
        showingRawData: false
    };

    render() {
        return <button type="button" className="btn btn-info btn-xs"
                       title="Show data used in this visualization"
                       onClick={this._toggleShowData}
        >
            <span className="glyphicon glyphicon-align-left"/>
            &nbsp;&nbsp;
            {('Raw JSON')}
        </button>;
    }

    _toggleShowData = () => {
        if (!this.state.fillRawData) {  // Fill on demand
            this.setState({fillRawData: true});
        }

        const $anchor = $('<span>');
        ReactDOM.render(
            <Dialog
                title="Raw JSON Data"
                onClose={function () {
                    // GC rogue modal
                    ReactDOM.unmountComponentAtNode($anchor[0]);
                }}
            >
                <PluginContent
                    data={this.props.data}
                    pluginCfg={CHARTHOUSE_PLUGIN_SPECS.rawText}
                />
            </Dialog>,
            $anchor[0]
        );
        this.setState({showingRawData: !this.state.showingRawData});
    };

}

export default RawData;
