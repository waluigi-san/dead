/* Gruntfile */
module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'component.json' ),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
            },
            build: {
                src: 'load.js',
                dest: 'load-<%= pkg.version %>\.min.js'
            }
        }
    });

};