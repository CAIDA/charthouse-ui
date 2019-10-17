# charthouse-ui
Web application UI for the Hi3 project (https://hicube.caida.org)

## Setup Local Test Environment

- `composer i`: install PhP dependencies
- `yarn`: install yarn-related dependencies
- `yarn encore dev --watch`: watch file changes and compile HTML/JS

## Add New React Dependencies

Take [`react-data-table-component`](https://www.npmjs.com/package/react-data-table-component)
as an example:
```
yarn add react-data-table-component styled-components
```

## Converting old React createClass to ES6 classes

 - Install jscodeshift (`npm install -g jscodeshift`)
 - Download react-codemod (`git clone https://github.com/reactjs/react-codemod.git`)
 - Install deps (`cd react-codemod; yarn install`)
 - Run jscodeshift
 
```
jscodeshift \
  -t ~/Downloads/react-codemod/transforms/class.js \
  --extensions=js,jsx \
  assets/js/Explorer/viz-plugins/stacked-horizon.jsx
```
