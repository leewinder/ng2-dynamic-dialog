# ng2-dynamic-dialog

A dynamically adjusting, extensible dialog component for use with Angular 2 supporting raw HTML content and injected custom components.  Contains no dependancies except Angular 2 and those packages required by Angular 2.

<img src="https://cloud.githubusercontent.com/assets/1649415/17697306/020f6b22-63ac-11e6-965a-e561cdcafd53.gif" data-canonical-src="https://cloud.githubusercontent.com/assets/1649415/17697306/020f6b22-63ac-11e6-965a-e561cdcafd53.gif" width="400""/>

## Installation
1. Add the package to your 'dependencies' list in package.json and run npm install

  `"ng2-dynamic-dialog": "^0.0.2"`
  
  Optionally, you can manually install the package using the npm command line

  `npm install ng2-dynamic-dialog`
  
2. Add ng2-dynamic-dialog to both your `map` and `packages` structures in `systemjs.config.js`

  ```javascript
  var map = {
    ...
    'ng2-dynamic-dialog': 'node_modules/ng2-dynamic-dialog'
  };
  ```
  
  ```javascript
  var packages = {
    ...
    'ng2-dynamic-dialog': { main: 'index.js', defaultExtension: 'js' },
  };
  ```
  
3. Optionally, add the `rootDir` option to `tsconfig.json` to make sure TypeScript's default root path algorithm doesn't pull in the `node_modules` folder
