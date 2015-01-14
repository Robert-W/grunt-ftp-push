/*
 * grunt-ftp
 * https://github.com/Robert-W/grunt-ftp
 *
 * Copyright (c) 2013 Robert Winterbottom
 * Licensed under the MIT license.
 */
 
module.exports = function (grunt) {
  'use strict';
  var Ftp = require('jsftp'),
      rootDestination,
      ftpServer,
      options,
      done;
  /**
   * @returns {Boolean} true is returned if the required options have all been supplied
   */
  function requirementsAreValid() {
    // host and dest are mandatory options
    return (options.host && options.dest);
  }

  /**
  * @param {string} dest - path to directory
  * @return {string} - Return dest with trailing slash if not present
  */
  function normalizeDir(dest) {
    return (dest.charAt(dest.length - 1) !== '/' ? dest + '/' : dest);
  }
  /**
  * @param {string} file - path to file
  * @return {string} - Return file with initial slash removed
  */
  function normalizeFilename(file) {
    return (file.charAt(0) === '/' ? file.slice(1) : file);
  }
  /**
   * @return {Array} returns string filepaths that are relative to options.dest,
   * they are reversed after filtering and mapping so they can be created in the correct order
   */
  function getFilePaths(filePaths) {
    var pathsForFiles = [];
    filePaths.forEach(function(f) {
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        pathsForFiles.push({
          path: filepath,
          cwd: f.orig.cwd,
          dest: f.orig.dest
        });
      });
    });
    return pathsForFiles.reverse();
  }
  /**
   * @return {Object} returns an object containing a username and password
   */
  function getCredentials() {
    if (options.authKey && grunt.file.exists('.ftpauth')) {
      return JSON.parse(grunt.file.read('.ftpauth'))[options.authKey];
    } else if (options.username && options.password) {
      return {
        username: options.username,
        password: options.password
      };
    } else {
      grunt.log.warn("Attempting Anonymous Login");
      return {
        username: null,
        password: null
      };
    }
  }
  /**
   * Passes an error to the callback if not able to complete its tasks
   * Creates all directories necessary so that files can be pushed to options.dest
   */
  function createDirectoriesForDestination(fileObjects, callback) {
    // Destination needs to end with / and not begin with / for following code to push correctly
    // Remove preceeding slash if present, just use normalizeFilename function, it will work for this
    var destination = normalizeFilename(options.dest),
        preparedDestination,
        destinations = [],
        partials = [],
        regex = /\//g,
        index = 0,
        match;

    destination = normalizeDir(destination);
    destinations.push(destination);

    // If there are other destinations specified in the dest obj of individual entries, add those here
    // so they can be created before I push any files to the server
    fileObjects.forEach(function (fileItem) {
      if (fileItem.dest) {
        // Prepare the destination, then push into array for processing
        preparedDestination = destination + normalizeDir(fileItem.dest);
        destinations.push(preparedDestination);
      } else {
        // Prepare the destination, then push into array for processing
        preparedDestination = destination + normalizeDir(fileItem.path);
        destinations.push(preparedDestination);
      }
    });

    // Create an array of directories that I will need to create
    // If the destination is / ignore it, else process it
    // This takes foo/bar/baz and returns ['foo','foo/bar','foo/bar/baz']
    destinations.forEach(function (directoryDest) {
      if (directoryDest.length !== 1) {
        while ((match = regex.exec(directoryDest)) !== null) {
          partials.push(directoryDest.slice(0, match.index));
        }
      }
    });    
    /**
     * Helper recursive function to push all directories that are present in partials array
     */
    function processPartials(err) {
      // Throw fatal error if any error other then error then 550 is present, will need these directories created to continue
      if (err) {
        if (err.code !== 550) { throw err; } // Directory Already Created
      } else {
        grunt.log.ok(partials[index] + " directory created successfully.");
      }

      ++index;

      if (index < partials.length) {
        // Push another directory and pass self as callback to continue processing the remaining partials
        ftpServer.raw.mkd(partials[index], processPartials);
      } else {
        callback(); // Call the callback to continue processing
      }
    }

    // Start making directories
    if (partials.length > 0) {
      ftpServer.raw.mkd(partials[index], processPartials);
    } else {
      callback();
    }
  }
  /**
   * Upload all files that are present in the paths array
   */
  function uploadFiles(paths) {
    // Fire keep alive to ftp server every 60 seconds to avoid session timeouts.
    ftpServer.keepAlive(options.keepAlive);
    /**
     * Helper recursive function to process all available paths
     */
    function processPaths() {
      if (paths.length < 1) {
        closeConnection();
        return;// We are completed, close connection and end the program
      }
      // Pop a file, file cannot start with a /, remove cwd from path unless it's . or ./
      var fileObject = paths.pop(),
          file = fileObject.path,
          cwd = fileObject.cwd,
          relativeDest,
          destPath;

      // Guarantee the path is pushed to the intended location
      // Remove cwd from path unless its . or ./
      destPath = ((cwd === '.' || cwd === './') ? file : file.replace(cwd, ''));
      // Remove / from start of file if present
      destPath = normalizeFilename(destPath);
      // file could have optional destination different from default, if so, add it here
      if (fileObject.dest) {
        // Make sure relative destination ends in /
        relativeDest = normalizeDir(fileObject.dest);
        destPath = rootDestination + relativeDest + destPath;
      } else {
        destPath = rootDestination + destPath;
      }

      // If directory, create it and continue processing
      if (grunt.file.isDir(file)) {
        ftpServer.raw.mkd(destPath, function (err, data) {
          if (err){
            if (err.code !== 550) { throw err; } // Directory Already Created
          } else {
            grunt.log.ok(destPath + " directory created successfully.");
          }
          processPaths(); // Continue Processing
        });
      } else {        
        ftpServer.put(grunt.file.read(file,{encoding:null}), destPath, function (err) {
          if (err) { 
            grunt.log.warn(destPath + " failed to transfer because " + err); // Notify User file could not be pushed
          } else {
            grunt.log.ok(destPath + " transferred successfully.");
          }
          processPaths(); // Continue Processing
        });
      }
    }    
    // Start the process
    processPaths();
  }
  /**
   * Close the connection and end the asynchronous task
   */
  function closeConnection(errMsg) {
    if (ftpServer) {
      ftpServer.raw.quit(function(err, res) {
        if (err) {
          grunt.log.error(err);
          done(false);
        }
        grunt.log.ok("FTP connection closed!");
        done();
      });
    } else if (errMsg) {
      grunt.log.warn(errMsg);
      done(false);
    } else {
      done();
    }
  }
  /**
   * Register Task and Begin Running the Plugin Here
   */
  grunt.registerMultiTask('ftp_push', 'Deploy files to a FTP server.', function() {

    var credentials,
        paths;

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      autoReconnect: true,
      reconnectLimit: 3,
      keepAlive: 60000
    });

    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    done = this.async();

    // Make Sure all requirements are valid
    if (!requirementsAreValid()) {
      closeConnection("You did not specify all the requirements.  Please refer to the documentation at " +
        "the following url for instructions. https://github.com/Robert-W/grunt-ftp-push#required-options");
      return;
    }

    // Create ftpServer Object
    ftpServer = new Ftp({
      host: options.host,
      port: options.port || 21
    });
    
    // Get filePaths
    paths = getFilePaths(this.files);

    // Get Authentication Object
    credentials = getCredentials();

    // Authenticate yourself to the server
    ftpServer.auth(credentials.username,credentials.password,function(err, res) {
      // If error, throw fatal
      if (err) { throw err; }
      grunt.log.ok(credentials.username + " successfully authenticated!");
      // Create directories specified in options.dest
      createDirectoriesForDestination(paths, function () {
        // Normalize destionation to be used in uploadFiles
        rootDestination = normalizeDir(options.dest);
        // Upload the files and close the connection on completion
        uploadFiles(paths);
      });

    });

  });

};
