# static-sender

Send is Connect's `static()` extracted for generalized use, a streaming static file
server supporting partial responses (Ranges), conditional-GET negotiation, high test coverage, and granular events which may be leveraged to take appropriate actions in your application or framework.

## Installation

```bash
# not yet
$ npm install static-sender
```

## Examples

Small:

```js
var http = require('http'),
    staticSender = require('send');

var send = staticSender();

var app = http.createServer(function(req, res){
  send(req, res);
}).listen(3000);
```

Serving from a root directory with custom error-handling:

```js
var http = require('http'),
    staticSender = require('static-sender'),
    url = require('url');

var send = staticSender({
  // transfer arbitrary files from within
  // /www/example.com/public/*
  root: '/www/example.com/public',
  // events
  on: {
    // your custom error-handling logic:
    error: function(req, res, err) {
      res.statusCode = err.status || 500;
      res.end(err.message);
    },
    // your custom directory handling logic:
    redirect: function(req, res) {
      res.statusCode = 301;
      res.setHeader('Location', req.url + '/');
      res.end('Redirecting to ' + req.url + '/');
    }
  }
});

var app = http.createServer(function(req, res){
  send(req, res, url.parse(req.url).pathname);
}).listen(3000);
```

## API

### Events

  - `error` an error occurred `(err)`
  - `directory` a directory was requested
  - `file` a file was requested `(path, stat)`
  - `stream` file streaming has started `(stream)`
  - `end` streaming has completed

Note: staticSender does not use real EventEmiiter events
to remove bloat, so only one handler can be used for each event.

### .root(dir)

Serve files relative to `path`.

### .index(path)

By default send supports "index.html" files, to disable this
invoke `.index(false)` or to supply a new index pass a string.

### .maxage(ms)

Provide a max-age in milliseconds for http caching, defaults to 0.

### .hidden(bool)

Enable or disable transfer of hidden files, defaults to false.

## Error-handling

By default when no `error` listeners are present an automatic response will be made, otherwise you have full control over the response, aka you may show a 5xx page etc.

## Caching

It does _not_ perform internal caching, you should use a reverse proxy cache such
as Varnish for this, or those fancy things called CDNs. If your application is small enough that it would benefit from single-node memory caching, it's small enough that it does not need caching at all ;).

## Debugging

To enable `debug()` instrumentation output export __DEBUG__:

```
$ DEBUG=static-sender node app
```

## Running tests

```
$ npm install
$ npm test
```

## License 

(The MIT License)

Copyright (c) 2013 [Benjamin Tan](http://d10.github.io)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
