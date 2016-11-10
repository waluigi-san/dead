// Import dependencies.
var fs = require('fs'),
    path = require('path'),
    semver = require('semver');

var files = fs.readdirSync(
  path.join(__dirname, '../assets/js')
);

var latestVersion = files.filter(function(fileName) {
  return !/\.js$/.test(fileName) && semver.valid(fileName);
}).reduce(function(latestVersion, currVersion) {
  if (semver.gt(currVersion, latestVersion)) {
    return currVersion;
  }
  return latestVersion;
});

// Export latest lodash version.
module.exports = latestVersion;
