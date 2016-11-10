var highlight = require('highlight.js'),
    marked = require('marked');

// Code highlighting.
marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

// Export Marked.
module.exports = marked;
