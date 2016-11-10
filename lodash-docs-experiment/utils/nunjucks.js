// Import dependencies.
var marked = require('./marked'),
    nunjucks = require('nunjucks'),
    nunjucksMarkdown = require('nunjucks-markdown'),
    path = require('path');

// Configure Nunjucks.
var env = nunjucks.configure(path.join(__dirname, '..'));

nunjucksMarkdown.register(env, function(str) {
  return marked(str)
    // Replace HTML comments with real HTML after Markdown is rendered,
    // to allow Markdown in block elements to be parsed.
    .replace(/<!-- /g, '<')
    .replace(/ -->/g, '>');
});

env.addFilter('markdown_escape', function(string) {
  return string.replace(/[*_]/g, '\\$&');
});

// Export Nunjucks environment.
module.exports = env;
