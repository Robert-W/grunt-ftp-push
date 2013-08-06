/*
 * grunt-ftp-push
 * http://robert-w.github.io/grunt-ftp-push
 *
 * Copyright (c) 2013 Robert Winterbottom
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    ftp_push: {
      default: {
        options: {
          authKey: "serverA",
          host: "sample.server.com",
          dest: "/html/test/",
          port: 21
        },
        files: [ // Enable Dynamic Expansion, Src matches are relative to this path, Actual Pattern(s) to match
          {expand: true,cwd: 'test',src: ['**/*']}
        ]
      }
    }


  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['ftp_push']);

};
