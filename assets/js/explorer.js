// external CSS deps
import '../css/theme/css/bootstrap-flatly.css';

// internal CSS dependencies
// TODO: move these to the components that need them (and break them up)
import '../css/base.css';
import '../css/Explorer/explorer.css';
import '../css/Explorer/viz-plugins.css';

// external JS deps
import React from 'react';

// internal JS deps
import Explorer from './Explorer/components/explorer';


React.render(<Explorer/>, document.getElementById('explorer-main'));
