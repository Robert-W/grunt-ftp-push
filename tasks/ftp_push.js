/*
 * grunt-ftp
 * https://github.com/Robert-W/grunt-ftp
 *
 * Copyright (c) 2013 Robert Winterbottom
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
	'use strict';
	
  var Ftp = require('jsftp'),
      filepaths = [],
      currentFileIndex = 0,
      length,
      options,
      ftpServer,
      done;

  var getAuthInfo = function(authKey) {
    if(grunt.file.exists('.ftpauth'))
      return JSON.parse(grunt.file.read('.ftpauth'))[authKey];
    else if (options.username && options.password){
      return {
        username: options.username,
        password: options.password
      };
    } else {
      return {
        username: null,
        password: null
      }; // Will Force the User to Use Anonymous Login
    }
  };

  var _recursiveUploads = function(file,terminator) {
    if(grunt.file.isDir(file)){
      var dirName = options.dest+file.split("/").slice(1).join("/");
      ftpServer.raw.mkd(dirName,function(err, data) {
        if (err){
          if(err.code !== 550) // Directory Already Created
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

  grunt.registerMultiTask('ftp_push', 'Deploy files to a FTP server.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options();
    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    done = this.async();

    ftpServer = new Ftp({
      host: options.host,
      port: options.port || 21
    });

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

    length = filepaths.length;

    if(length < 1){
      grunt.log.error("No Files Found to Transfer.");
      done();
    }

    var key = getAuthInfo(options.authKey);

    ftpServer.auth(key.username,key.password,function(err, res) {
      if (err) throw err;
      grunt.log.ok(key.username + " successfully authenticated!");

      _recursiveUploads(filepaths[currentFileIndex],false);

    });

  });

};