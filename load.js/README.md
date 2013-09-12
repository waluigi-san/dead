# load.js v0.1.0

load.js is a simple JS and CSS resource loader

load.js is meant to be an extra small resource loader, with the ability to customise builds, to pick and choose which feature is needed.

## Usage

There are three main functions in load.js:
- load( str, callback )
- load.js( str, callback)
- load.css( str, callback )

load( str, callback )

The first function, load, just checks the string passed in and sends it to one of the other two functions. This is done by checking whether the URL passed in ends with '.css' or begins with 'css!' (based on [Yepnope](http://yepnopejs.com)). If so, it calls load.css, otherwise all other URLs default to load.js.
