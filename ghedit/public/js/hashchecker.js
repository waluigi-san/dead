// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

var HashChecker = {

    // The default interval to poll for hash changes, if necessary, is
    // ten times a second.
    interval: 100,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function() {
      var match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Start the hash change handling
    start: function(root) {

      var docMode  = document.documentMode;
      var oldIE = (/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())
        && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + root + '/').replace(rootStripper, '/');

      if (('onhashchange' in window) && !oldIE) {
        window.addEventListener('hashchange', this.checkUrl);
      } else {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }
      router();
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `router`
    checkUrl: function(e) {
      var current = this.getHash();
      if (current == prev) return;
      router();
    }

  };
