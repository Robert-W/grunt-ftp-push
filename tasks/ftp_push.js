/*
 * grunt-ftp
 * https://github.com/Robert-W/grunt-ftp
 *
 * Copyright (c) 2013 Robert Winterbottom
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ftp_push', 'Deploy files to a FTP server.', function() {

    var Ftp = require('jsftp');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    // filepaths array to store all the files found by grunt
    var filepaths = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        filepaths.push(filepath);
      });

    });

    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    var done = this.async();


    var ftpServer = new Ftp({
      host: options.host,
      port: options.port || 21
    });

    var currentFileIndex = 0;
    var length = filepaths.length;

    if(length < 1){
      grunt.log.error("No Files Found to Transfer.");
      done();
    }

    ftpServer.auth(options.username,options.password,function(err, res) {
      if (err) throw err;

      grunt.log.ok(options.username + " successfully authenticated!");

      // Helper function to perform upload process
      var _recursiveUploads = function(file,terminator) {

        if(grunt.file.isDir(file)){
          var dirName = options.dest+file.split("/").slice(1).join("/");
          ftpServer.raw.mkd(dirName,function(err, data) {
            if (err){
              if(err.code !== 550)
                throw err;
            }
            currentFileIndex++;
            if(currentFileIndex === length){
              terminator = true;
              ftpServer.raw.quit(function(err, res) {
                if (err) {
                  grunt.log.error(err);
                  done();
                }
                grunt.log.ok("FTP connection closed!");
                done();
              });
            }
            if(!terminator)
              _recursiveUploads(filepaths[currentFileIndex],terminator);
          });
        } else {
          var filename = file.split("/");
          filename = filename.slice(1).join("/");
          var destination = options.dest + filename;
          ftpServer.put(grunt.file.read(file,{encoding:null}),destination,function(err){
            if(err){
              grunt.log.error(filepaths[currentFileIndex]+" transfer failed.");
              currentFileIndex++;
            } else {
              grunt.log.ok(filepaths[currentFileIndex]+" transferred successfully.");
              currentFileIndex++;
            }
            if(currentFileIndex === length){
              terminator = true;
              ftpServer.raw.quit(function(err, res) {
                if (err) {
                  grunt.log.error(err);
                  done();
                }
                grunt.log.ok("FTP connection closed!");
                done();
              });
            }
            if(!terminator)
              _recursiveUploads(filepaths[currentFileIndex],terminator);
          });
        }

      };

      _recursiveUploads(filepaths[currentFileIndex],false);

    });  // End ftpServer.auth();

  });

};