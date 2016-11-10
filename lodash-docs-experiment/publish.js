// Import dependencies.
var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    templateHelper = require('jsdoc/util/templateHelper'),
    utils = require('./utils');

// Utilities.
var _ = utils.lodash,
    nunjucks = utils.nunjucks;

// Obtain the value for the given JSDoc tag.
function valueForTitle(title, xs) {
  var doc = _.find(xs, { title: title })
  return _.get(doc, 'value', '');
}

function simplifyData(d) {
  return {
    category: d.tags ? valueForTitle('category', d.tags) : '',
    description: d.description || '',
    example: _.get(d, 'examples', null),
    name: d.name || '',
    longname: d.longname || '',
    params: _.isArray(d.params) ? d.params.map(function(p) {
      var param = {
        type: p.type.names[0] || '',
        description: p.description || '',
        name: p.name || ''
      };
      if (p.type.names.length > 1) {
        param.type = p.type.names.join('|');
      }
      if (p.optional) {
        if (p.defaultvalue != null) {
          param.name += '=' + p.defaultvalue;
        }
        param.name = '[' + param.name + ']';
      }
      return param;
    }) : null,
    returns: {
      type: _.get(d, 'returns[0].type.names[0]', ''),
      description: _.get(d, 'returns[0].description', '')
    },
    original: d
  };
}

exports.publish = function(data, opts) {
  var docs = templateHelper.prune(data)()
    .order('name')
    .filter({kind: ['function', 'constant']})
    .get();
  docs = _.chain(docs)
    .map(simplifyData)
    .groupBy('category')
    .value();
  docs.categories = _.keys(docs).sort();
  var context = {
    docs: docs,
    site: process.env.SITE_URL || '',
    version: utils.latestVersion
  };

  mkdirp.sync(opts.destination);
  fs.writeFileSync(
    path.join(opts.destination, 'index.html'),
    nunjucks.render(
      path.join(__dirname, 'templates/docs.html'),
      context
    ),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(opts.destination, 'data.json'),
    JSON.stringify(context.docs, null, 2),
    'utf-8'
  );
};
