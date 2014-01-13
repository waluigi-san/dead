lodash-webbuilder
=================

web-based builder for lodash, based on lodash-cli

100% WIP

how it should work:

 - fork lodash-cli
 - since it's in js, just add define wrappers
 - require then with amd/require.js
 - add _fake_ node.js lib wrappers eg. fs, path, vm, glob ...
 - use require.config to set up paths for fake libs.
 - success!
