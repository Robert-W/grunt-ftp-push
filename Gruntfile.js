/*
 * grunt-ftp-push
 * http://robert-w.github.io/grunt-ftp-push
 *
 * Copyright (c) 2013 Robert Winterbottom
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({

    ftp_push: {
      default: {
        options: {
          authKey: 'serverA',
          host: 'sample.server.com',
          dest: '/html/test/',
          port: 21
        },
        files: [ // Enable Dynamic Expansion, Src matches are relative to this path, Actual Pattern(s) to match
          {expand: true, cwd: 'files/nested/another', src: ['*.js'], dest: './files/js'},
          {expand: true, cwd: './', src: ['files/js/**/*.js']}
        ]
      },

      sample: {
        options: {
          host: 'sample.server.com',
          dest: '/html/test/',
          username: 'myUsername',
          password: 'myPassword',
          debug: true // Show JSFTP Debugging information
        },
        files: [
          {expand: true, cwd: './', src: ['files/nested/another/sample.js']}
        ]
      },

      local: {
        options: {
          host: '127.0.0.1',
          dest: './',
          username: 'local_user',
          password: '12345',
          port: 3334
        },
        files: [
          {expand: true, cwd: './', src: ['files/js/**/*.js']}
        ]
      }

    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['ftp_push:default']);
  grunt.registerTask('sample', ['ftp_push:sample']);
  grunt.registerTask('local', ['ftp_push:local']);

};
