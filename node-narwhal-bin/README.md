# narwhal-bin

narwhal-bin is a Node.js binary wrapper for [Narwhal](https://github.com/280north/narwhal) 0.3.2.

## Installation

```bash
$ npm install --save narwhal-bin
```

## Usage

```js
var child_process = require('child_process');
var narwhal = require('narwhal-bin');

// Using `child_process.spawn`
var proc = child_process.spawn(narwhal.path, ['file.js']);

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
child_process.execFile(narwhal.path, ['file.js'], function (err) {
  if (err) { throw err; }

  console.log('`file.js` ran!');
});
```

## CLI

```bash
$ npm install --global narwhal-bin
```

```bash
$ narwhal --help
```

## Author

| [![twitter/demoneaux](http://gravatar.com/avatar/029b19dba521584d83398ada3ecf6131?s=70)](https://twitter.com/demoneaux "Follow @demoneaux on Twitter") |
|---|
| [Benjamin Tan](http://d10.github.io/) |
