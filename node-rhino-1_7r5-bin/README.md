# rhino-1_7r5-bin

rhino-1_7r5-bin is a Node.js binary wrapper for [Rhino](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino) 1.7R5. Other binaries are also available for Rhino [1.7R3](https://www.npmjs.org/package/rhino-1_7r3-bin) and [1.7R4](https://www.npmjs.org/package/rhino-1_7r4-bin).

## Installation

```bash
$ npm install --save rhino-1_7r5-bin
```

## Usage

```js
var child_process = require('child_process');
var rhino = require('rhino-1_7r5-bin');

// Using `child_process.spawn`
var proc = child_process.spawn('java', ['-jar'].concat(rhino.path, 'file.js'));

proc.stdout.on('data', function (data) {
  console.log(data);
});

proc.stderr.on('data', function (data) {
  console.log(data);
});

proc.on('close', function (code) {
  console.log('Code ' + code);
});

// Using `child_process.execFile`
child_process.execFile(rhino.binPath, ['file.js'], function (err) {
  if (err) { throw err; }

  console.log('`file.js` ran!');
});
```

## CLI

```bash
$ npm install --global rhino-1_7r5-bin
```

```bash
$ rhino1_7r5 -help
Usage: java org.mozilla.javascript.tools.shell.Main [options...] [files]
Valid options are:
    -?, -help          Displays help messages.
    -w                 Enable warnings.
    -version 100|110|120|130|140|150|160|170|180
                       Set a specific language version.
    -opt [-1|0-9]      Set optimization level.
    -f script-filename Execute script file, or "-" for interactive.
    -e script-source   Evaluate inline script.
    -modules [uri]     Add a single path or URL element to the CommonJS
                       module search path. (implies -require)
    -require           Enable CommonJS module support.
    -sandbox           Enable CommonJS sandbox mode. (implies -require)
    -debug             Generate debug code.
    -strict            Enable strict mode warnings.
    -fatal-warnings    Treat warnings as errors.
    -encoding charset  Use specified character encoding as default when reading scripts.
```

## Author

| [![twitter/demoneaux](http://gravatar.com/avatar/029b19dba521584d83398ada3ecf6131?s=70)](https://twitter.com/demoneaux "Follow @demoneaux on Twitter") |
|---|
| [Benjamin Tan](http://d10.github.io/) |
