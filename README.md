cytoscape-no-overlap
================================================================================


## Description

Cytoscape extension to help prevent overlap of nodes on dragging ([demo](https://mo0om.github.io/cytoscape-no-overlap))

## Dependencies

 * Cytoscape.js ^3.2.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-no-overlap`,
 * via bower: `bower install cytoscape-no-overlap`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import noOverlap from 'cytoscape-no-overlap';

cytoscape.use( noOverlap );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let noOverlap = require('cytoscape-no-overlap');

cytoscape.use( noOverlap ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-no-overlap'], function( cytoscape, noOverlap ){
  noOverlap( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

The extension takes an object with one property called padding which is the amount of pixels between the nodes 
(default = 0). 

example: `cy.nodes().noOverlap({ padding: 5 });`


## Build targets

* `npm run test` : Run Mocha tests in `./test`
* `npm run build` : Build `./src/**` into `cytoscape-no-overlap.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build:release`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-no-overlap https://github.com/mo0om/cytoscape-no-overlap.git`
1. [Make a new release](https://github.com/mo0om/cytoscape-no-overlap/releases/new) for Zenodo.
