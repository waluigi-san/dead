
/**
 * Module dependencies.
 */

var debug = require('debug')('static-sender')
  , parseRange = require('range-parser')
  , Stream = require('stream')
  , mime = require('mime')
  , fresh = require('fresh')
  , path = require('path')
  , http = require('http')
  , fs = require('fs')
  , basename = path.basename
  , normalize = path.normalize
  , join = path.join
  , utils = require('./utils');

/**
 * Expose `staticSender`.
 */

exports = module.exports = staticSender;

/**
 * Expose mime module.
 */

exports.mime = mime;

/**
 * Return a function.
 *
 * @param {Object} opts
 * @param {Object} streamOpts
 * @return {SendStream}
 * @api public
 */

function staticSender(opts, streamOpts) {
  opts = utils.configure(opts || {});
  streamOpts || (streamOpts = {});

  var root = opts.root,
    index = opts.index,
    maxage = opts.maxage,
    hidden = ops.hidden,


  var send = function (req, res, _url) {
    var self = this
      , args = arguments
      , path = this.path
      , root = this._root;

    // references
    this.res = res;

    // invalid request uri
    path = utils.decode(path);
    if (-1 == path) return error(400);

    // null byte(s)
    if (~path.indexOf('\0')) return error(400);

    // join / normalize from optional root dir
    if (root) path = normalize(join(root, path));

    // ".." is malicious without "root"
    if (isMalicious()) return error(403);

    // malicious path
    if (root && 0 != path.indexOf(root)) return error(403);

    // hidden file support
    if (!hidden && hasLeadingDot()) return error(404);

    // index file support
    if (index && hasTrailingSlash()) path += index;

    debug('stat "%s"', path);
    fs.stat(path, function(err, stat){
      if (err) return onStatError(err);
      if (stat.isDirectory()) return redirect(self.path);
      self.emit('file', path, stat);
      self.send(path, stat);
    });

    return res;
  };

  'root index hidden maxage'.split().forEach(function (i) {
    send[i] = function (a) {
      var newOpts = utils.extend({}, opts);
      newOpts[i] = a;
      return new staticSender(newOpts);
    };
  });

  return send;
}


/**
 * Emit error with `status`.
 *
 * @param {Number} status
 * @api private
 */

function error (status, err){
  var res = this.res;
  var msg = http.STATUS_CODES[status];
  err = err || new Error(msg);
  err.status = status;
  if (this.listeners('error').length) return this.emit('error', err);
  res.statusCode = err.status;
  res.end(msg);
};

/**
 * Check if the pathname is potentially malicious.
 *
 * @return {Boolean}
 * @api private
 */

function isMalicious (){
  return !this._root && ~this.path.indexOf('..');
};

/**
 * Check if the pathname ends with "/".
 *
 * @return {Boolean}
 * @api private
 */

function hasTrailingSlash (){
  return '/' == this.path[this.path.length - 1];
};

/**
 * Check if the basename leads with ".".
 *
 * @return {Boolean}
 * @api private
 */

function hasLeadingDot (){
  return '.' == basename(this.path)[0];
};

/**
 * Check if this is a conditional GET request.
 *
 * @return {Boolean}
 * @api private
 */

function isConditionalGET (){
  return this.req.headers['if-none-match']
    || this.req.headers['if-modified-since'];
};

/**
 * Strip content-* header fields.
 *
 * @api private
 */

function removeContentHeaderFields (){
  var res = this.res;
  Object.keys(res._headers).forEach(function(field){
    if (0 == field.indexOf('content')) {
      res.removeHeader(field);
    }
  });
};

/**
 * Respond with 304 not modified.
 *
 * @api private
 */

function notModified (){
  var res = this.res;
  debug('not modified');
  this.removeContentHeaderFields();
  res.statusCode = 304;
  res.end();
};

/**
 * Check if the request is cacheable, aka
 * responded with 2xx or 304 (see RFC 2616 section 14.2{5,6}).
 *
 * @return {Boolean}
 * @api private
 */

function isCachable (){
  var res = this.res;
  return (res.statusCode >= 200 && res.statusCode < 300) || 304 == res.statusCode;
};

/**
 * Handle stat() error.
 *
 * @param {Error} err
 * @api private
 */

function onStatError (err){
  var notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
  if (~notfound.indexOf(err.code)) return this.error(404, err);
  this.error(500, err);
};

/**
 * Check if the cache is fresh.
 *
 * @return {Boolean}
 * @api private
 */

function isFresh (){
  return fresh(this.req.headers, this.res._headers);
};

/**
 * Redirect to `path`.
 *
 * @param {String} path
 * @api private
 */

function redirect (path){
  if (this.listeners('directory').length) return this.emit('directory');
  var res = this.res;
  path += '/';
  res.statusCode = 301;
  res.setHeader('Location', path);
  res.end('Redirecting to ' + utils.escape(path));
};

/**
 * Transfer `path`.
 *
 * @param {String} path
 * @api public
 */

SendStream.prototype.send = function(path, stat){
  var options = this.options;
  var len = stat.size;
  var res = this.res;
  var req = this.req;
  var ranges = req.headers.range;
  var offset = options.start || 0;

  // set header fields
  this.setHeader(stat);

  // set content-type
  this.type(path);

  // conditional GET support
  if (this.isConditionalGET()
    && this.isCachable()
    && this.isFresh()) {
    return this.notModified();
  }

  // adjust len to start/end options
  len = Math.max(0, len - offset);
  if (options.end !== undefined) {
    var bytes = options.end - offset + 1;
    if (len > bytes) len = bytes;
  }

  // Range support
  if (ranges) {
    ranges = parseRange(len, ranges);

    // unsatisfiable
    if (-1 == ranges) {
      res.setHeader('Content-Range', 'bytes */' + stat.size);
      return this.error(416);
    }

    // valid (syntactically invalid ranges are treated as a regular response)
    if (-2 != ranges) {
      options.start = offset + ranges[0].start;
      options.end = offset + ranges[0].end;

      // Content-Range
      res.statusCode = 206;
      res.setHeader('Content-Range', 'bytes '
        + ranges[0].start
        + '-'
        + ranges[0].end
        + '/'
        + len);
      len = options.end - options.start + 1;
    }
  }

  // content-length
  res.setHeader('Content-Length', len);

  // HEAD support
  if ('HEAD' == req.method) return res.end();

  this.stream(path, options);
};

/**
 * Stream `path` to the response.
 *
 * @param {String} path
 * @param {Object} options
 * @api private
 */

SendStream.prototype.stream = function(path, options){
  // TODO: this is all lame, refactor meeee
  var self = this;
  var res = this.res;
  var req = this.req;

  // pipe
  var stream = fs.createReadStream(path, options);
  this.emit('stream', stream);
  stream.pipe(res);

  // socket closed, done with the fd
  req.on('close', stream.destroy.bind(stream));

  // error handling code-smell
  stream.on('error', function(err){
    // no hope in responding
    if (res._header) {
      console.error(err.stack);
      req.destroy();
      return;
    }

    // 500
    err.status = 500;
    self.emit('error', err);
  });

  // end
  stream.on('end', function(){
    self.emit('end');
  });
};

/**
 * Set content-type based on `path`
 * if it hasn't been explicitly set.
 *
 * @param {String} path
 * @api private
 */

function type (path){
  var res = this.res;
  if (res.getHeader('Content-Type')) return;
  var type = mime.lookup(path);
  var charset = mime.charsets.lookup(type);
  debug('content-type %s', type);
  res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
};

/**
 * Set reaponse header fields, most
 * fields may be pre-defined.
 *
 * @param {Object} stat
 * @api private
 */

function setHeader (stat){
  var res = this.res;
  if (!res.getHeader('Accept-Ranges')) res.setHeader('Accept-Ranges', 'bytes');
  if (!res.getHeader('ETag')) res.setHeader('ETag', utils.etag(stat));
  if (!res.getHeader('Date')) res.setHeader('Date', new Date().toUTCString());
  if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + (this._maxage / 1000));
  if (!res.getHeader('Last-Modified')) res.setHeader('Last-Modified', stat.mtime.toUTCString());
};
