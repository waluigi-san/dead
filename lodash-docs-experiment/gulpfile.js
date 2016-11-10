// Import dependencies.
var childProcess = require('child_process'),
    gulp = require('gulp'),
    utils = require('./utils');

// Latest lodash version.
var LATEST_VERSION = utils.latestVersion;

// Remove previous built files.
function clean() {
  return utils.del('build');
}

// Copy assets.
function assets() {
  return gulp.src('assets/**/*', { base: 'assets' })
    .pipe(gulp.dest('build'));
}

// Compile Nunjucks templates.
function compile() {
  return gulp.src('src/**/*.html', { base: 'src' })
    .pipe(utils.gulpNunjucks.compile({
      site: process.env.SITE_URL || '',
      version: LATEST_VERSION
    }, {
      env: utils.nunjucks
    }))
    .pipe(gulp.dest('build'));
}

// Generate documentation using custom JSDoc template.
function docsJsdocCustom(done) {
  childProcess.exec([
    './node_modules/.bin/jsdoc',
    '--template', '.',
    '--destination', 'build/docs',
    'assets/js/' + LATEST_VERSION + '/lodash.js'
  ].join(' '), function(err, stdout, stderr) {
    done(err || null);
  });
}

// Generate documentation using default JSDoc template.
function docsJsdocDefault(done) {
  childProcess.exec([
    './node_modules/.bin/jsdoc',
    '--destination', 'build/docs/jsdoc',
    'assets/js/' + LATEST_VERSION + '/lodash.js'
  ].join(' '), function(err, stdout, stderr) {
    done(err || null);
  });
}

// Export Gulp tasks.
gulp.task('clean', clean);

gulp.task('assets', assets);
gulp.task('compile', compile);
gulp.task('build:site', gulp.parallel('assets', 'compile'));

gulp.task('docs:jsdoc:custom', docsJsdocCustom);
gulp.task('docs:jsdoc:default', docsJsdocDefault);
gulp.task('build:docs', gulp.parallel('docs:jsdoc:custom', 'docs:jsdoc:default'));

gulp.task('build', gulp.series('clean', gulp.parallel('build:site', 'build:docs')));
gulp.task('default', gulp.parallel('build'));
