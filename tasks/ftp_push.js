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
      filePaths = [],
      failCount = 0,
      ftpServer,
      tempFile,
      options,
      length,
      done;

  var getAuthInfo = function(authKey) {
    if(grunt.file.exists('.ftpauth')) {
      return JSON.parse(grunt.file.read('.ftpauth'))[authKey];
    } else if (options.username && options.password){
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

  var uploadFiles = function(files) {
    var file = tempFile = files.pop(),
      path = options.dest + ((file.search("/") > -1) ? file.split("/").slice(1).join("/") : file);

    if (grunt.file.isDir(file)) {
      ftpServer.raw.mkd(path,function(err, data) {
        if (err){
          if(err.code !== 550) { // Directory Already Created
            throw err;
          }
        }
        // Set temp to undefined so that if there is a disconnect, it does not
        // push this file back into the queue and upload it twice
        tempFile = undefined;
        checkForMore(files);
      });
    } else {
      ftpServer.put(grunt.file.read(file,{encoding:null}),path,function(err){
        if(err){
          grunt.log.error(path+" transfer failed because " + err);
        } else {
          // Set temp to undefined so that if there is a disconnect, it does not
          // push this file back into the queue and upload it twice
          tempFile = undefined;
          grunt.log.ok(path+" transferred successfully.");
        }
        checkForMore(files);
      });
    }
  };

  var checkForMore = function (files) {
    if (files.length > 0) {
      uploadFiles(files);
    } else {
      // Close the connection when completed
      closeConnection();
    }
  };

  var closeConnection = function () {
    ftpServer.raw.quit(function(err, res) {
      if (err) {
        grunt.log.error(err);
        done();
      }
      grunt.log.ok("FTP connection closed!");
      done();
    });
  };

  var uploadReconnect = function(files) {

    if (failCount !== options.reconnectLimit) {
      try {
        uploadFiles(files);
      } catch (err) {
        grunt.log.error("There was an error uploading your files. Attempting to upload again.");
        failCount += 1;
        if (tempFile) {
          files.push(tempFile);
        }
        uploadReconnect(files);
      }
    } else {
      grunt.log.error("Check your connection.  FTP is having trouble connecting or staying connected.");
      closeConnection();
    }

  };

  var createDestinationIfNotExist = function (callback) {    

    var count;

    if (options.dest.charAt(options.dest.length -1) !== "/") {
      options.dest += "/";
    }

    count = options.dest.match(/\//g).length;

    // If the array contains a long path, make sure all the directories are created
    // else, just make sure the one directory is created
    if (count > 1) {
      addMultipleDirectoriesFromDestination(count, callback);
    } else {      
      ftpServer.raw.mkd(options.dest, function (err, data) {
        grunt.log.ok(options.dest + " directory created successfully.");
        callback(err, data);
      });
    }

  };

  var addMultipleDirectoriesFromDestination = function (count, callback) {

    var partials = [],
        regex = /\//g,
        index = 0,
        hasMoreDirs,
        match;

    while ((match = regex.exec(options.dest)) !== null) {
      partials.push(options.dest.slice(0, match.index));
    }

    hasMoreDirs = function (err, data) {
      if (err){
        if(err.code !== 550) { // Directory Already Created
          throw err;
        }
      } else {
        grunt.log.ok(partials[index] + " directory created successfully.");
      }

      index++;
      if (index < partials.length) {
        ftpServer.raw.mkd(partials[index], hasMoreDirs);
      } else {
        callback();
      }
    };
    ftpServer.raw.mkd(partials[index], hasMoreDirs);

  };

  grunt.registerMultiTask('ftp_push', 'Deploy files to a FTP server.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      autoReconnect: true,
      reconnectLimit: 3
    });
    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    done = this.async();

    ftpServer = new Ftp({
      host: options.host,
      port: options.port || 21
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        filePaths.push(filepath);
      });
    });


    length = filePaths.length;

    if(length < 1){
      grunt.log.error("No Files Found to Transfer.");
      done();
    } 

    var key = getAuthInfo(options.authKey);

    ftpServer.auth(key.username,key.password,function(err, res) {
      if (err) { throw err; }
      grunt.log.ok(key.username + " successfully authenticated!");
      createDestinationIfNotExist(function (err, data) {
        if (err){
          if(err.code !== 550) { // Directory Already Created
            throw err;
          }
        }

        // Reverse filePaths array since I am popping files off, need them popped off in the correct order
        // to prevent errors pushing files to directories that dont exist
        filePaths.reverse();

        // if (options.autoReconnect) {
        //   uploadReconnect(filePaths);
        // } else {
          uploadFiles(filePaths);
        //}
      });
    });

  });

};