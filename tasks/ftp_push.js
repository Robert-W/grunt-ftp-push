/*
 * grunt-ftp
 * https://github.com/Robert-W/grunt-ftp
 *
 * Copyright (c) 2013 Robert Winterbottom
 * Licensed under the MIT license.
 */
var messages = require('./messages');
var utils = require('./utils');
var path = require('path');
var Ftp = require('jsftp');

module.exports = function (grunt) {
  'use strict';

  var basepath,
      options,
      server,
      done;

  /**
  * Based off of whats in the options, create a credentials object
  * @param {object} options - grunt options provided to the plugin
  * @return {object} {username: '...', password: '...'}
  */
  var getCredentials = function getCredentials(gruntOptions) {
    if (gruntOptions.authKey && grunt.file.exists('.ftpauth')) {
      return JSON.parse(grunt.file.read('.ftpauth'))[gruntOptions.authKey];
    } else if (gruntOptions.username && gruntOptions.password) {
      return { username: gruntOptions.username, password: gruntOptions.password };
    } else {
      // Warn the user we are attempting an anonymous login
      grunt.log.warn(messages.anonymousLogin);
      return { username: null, password: null };
    }
  };

  /**
  * Helper function that uses a recursive style for creating directories until none remain
  * @param {array} directories - Array of directory paths that will be necessary to upload files
  * @param {function} callback - function to trigger when all directories have been created
  */
  var pushDirectories = function pushDirectories(directories, callback) {
    var index = 0;

    /**
    * Recursive helper used as callback for server.raw.mkd
    * @param {error} err - Error message if something went wrong
    */
    var processDir = function processDir (err) {
      // Fail if any error other then 550 is present, 550 is Directory Already Exists
      // these directories must exist to continue
      if (err) {
        if (err.code !== 550) { grunt.fail.warn(err); }
      } else {
        grunt.log.ok(messages.directoryCreated(directories[index]));
      }

      ++index;
      // If there is more directories to process then keep going
      if (index < directories.length) {
        server.raw.mkd(directories[index], processDir);
      } else {
        callback();
      }
    };

    // Start processing dirs or end if none are present
    if (index < directories.length) {
      server.raw.mkd(directories[index], processDir);
    } else {
      callback();
    }
  };

  /**
  * Helper function that uses a recursive style for uploading files until none remain
  * @param {object[]} files - Array of file objects to upload, {src: '...', dest: '...'}
  */
  var uploadFiles = function uploadFiles(files) {
    var index = 0,
        file = files[index];

    /**
    * Recursive helper used as callback for server.raw.put
    * @param {error} err - Error message if something went wrong
    */
    var processFile = function processFile (err) {
      if (err) {
        grunt.log.warn(messages.fileTransferFail(file.dest, err));
      } else {
        grunt.log.ok(messages.fileTransferSuccess(file.dest));
      }

      ++index;
      // If there are more files, then keep pushing
      if (index < files.length) {
        file = files[index];
        server.put(grunt.file.read(file.src, { encoding: null }), file.dest, processFile);
      } else {
        // Close the connection, we are complete
        server.raw.quit(function(quitErr) {
          if (quitErr) {
            grunt.log.error(quitErr);
            done(false);
          }
          server.destroy();
          grunt.log.ok(messages.connectionClosed);
          done();
        });
      }
    };

    // Start uploading files
    server.put(grunt.file.read(file.src, { encoding: null }), file.dest, processFile);
  };

  grunt.registerMultiTask('ftp_push', 'Transfer files using FTP.', function() {

    var destinations,
        files,
        creds,
        dirs;

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      autoReconnect: true,
      reconnectLimit: 3,
      keepAlive: 60000,
      hideCredentials: false
    });

    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    done = this.async();

    // Check for minimum requirements
    if (!utils.optionsAreValid(options)) {
      grunt.log.warn(messages.invalidRequirements);
      done(false);
      return;
    }

    // Remove directories and invalid paths from this.files
    this.files.forEach(function (file) {
      file.src = file.src.filter(function (filepath) {
        // If the file does not exist, remove it
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn(messages.fileNotExist(filepath));
          return false;
        }
        // If this is a file, keep it
        return grunt.file.isFile(filepath);
      });
    });

    // Basepath of where to push
    basepath = path.posix.normalize(options.dest);
    // Get Credentials
    creds = getCredentials(options);
    // Get list of file objects to push, containing src & path properties
    files = utils.getFilePaths(basepath, this.files);
    // Get a list of the required directories to push so the files can be uploaded
    // getDirectoryPaths takes an array of strings, get a string[] of destinations
    destinations = utils.getDestinations(files);
    dirs = utils.getDirectoryPaths(destinations);
    // Create the FileServer
    server = new Ftp({
      host: options.host,
      port: options.port || 21,
      debugMode: options.debug || false
    });

    // Log if in debug mode
    if (options.debug) {
      server.on('jsftp_debug', function(eventType, data) {
        grunt.log.write(messages.debug(eventType));
        grunt.log.write(JSON.stringify(data, null, 2));
      });
    }

    // Authenticate with the server and begin pushing files up
    server.auth(creds.username, creds.password, function(err) {
      // Use <username> in out put if they chose to hide username
      var usernameForOutput = options.hideCredentials ? '<username>' : 'creds.username';
      // If there is an error, just fail
      if (err) {
        grunt.fail.fatal(messages.authFailure(usernameForOutput));
      } else {
        grunt.log.ok(messages.authSuccess(usernameForOutput));
      }

      // Push directories first
      pushDirectories(dirs, function () {
        // Directories have successfully been pushed, now upload files
        uploadFiles(files);
      });

    });

  });

};
