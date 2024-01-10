const webpackConfig = require('./webpack.config.js');

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    webpack: {
      myConfig: webpackConfig,
    },
    watch: {
      webpack: {
        files: [
            './src/dapp-common.js',
            './src/flare-utils.js',
        ],
        tasks: ['webpack']
      }
    },
  });

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
