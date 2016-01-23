# ringo-0_10-bin

ringo-0_10-bin is a Node.js binary wrapper for [Ringo](http://ringojs.org/) 0.10. Other binaries are also available for Ringo [0.9](https://www.npmjs.org/package/ringo-0_9-bin).

## Installation

```bash
$ npm install --save ringo-0_10-bin
```

## Usage

```js
var child_process = require('child_process');
var ringo = require('ringo-0_10-bin');

// Using `child_process.spawn`
var proc = child_process.spawn(ringo.path, ['file.js']);

proc.stdout.on('data', function (data) {
  console.log(data);
});

proc.stderr.on('data', function (data) {
  console.log(data);
});

proc.on('close', function (code) {
  console.log('Code ' + code);
});
```

## CLI

```bash
$ npm install --global ringo-0_10-bin
```

```bash
$ ringo0_10 --help
Usage:
  ringo [option] ... [script] [arg] ...
Options:
  -b --bootscript FILE    Run additional bootstrap script
  -c --charset CHARSET    Set character encoding for scripts (default: utf-8)
  -D --java-property K=V  Set Java system property K to value V
  -d --debug              Run with debugger GUI
  -e --expression EXPR    Run the given expression as script
  -h --help               Display this help message
  -H --history FILE       Use custom history file (default: ~/.ringo-history)
  -i --interactive        Start shell after script file has run
  -l --legacy-mode        Enable __parent__ and __proto__ and suppress warnings
  -m --modules DIR        Add a directory to the module search path
  -o --optlevel OPT       Set Rhino optimization level (-1 to 9)
  -p --production         Disable module reloading and warnings
  -P --policy URL         Set java policy file and enable security manager
  -s --silent             Disable shell prompt and echo for piped stdin/stdout
  -V --verbose            Print java stack traces on errors
  -v --version            Print version number and exit
```

## Author

| [![twitter/demoneaux](http://gravatar.com/avatar/029b19dba521584d83398ada3ecf6131?s=70)](https://twitter.com/demoneaux "Follow @demoneaux on Twitter") |
|---|
| [Benjamin Tan](http://d10.github.io/) |
