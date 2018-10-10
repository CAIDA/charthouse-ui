// external CSS deps
import '../css/theme/css/bootstrap-flatly.css';

// global CSS styles
// TODO: there are probably some explorer-specific styles in here
import '../css/base.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Explorer from "./Explorer/components/explorer";

ReactDOM.render((
    <Explorer/>
), document.getElementById('root'));
