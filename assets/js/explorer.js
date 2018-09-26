// CSS dependencies
import '../css/base.css';
import '../css/Explorer/explorer.css';
import '../css/Explorer/viz-plugins.css';

// JS deps
import Explorer from './Explorer/explorer';
import React from 'react';

React.render(<Explorer/>, document.getElementById('explorer-main'));
