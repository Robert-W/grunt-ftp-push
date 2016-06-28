var path = require('path');
var fs = require('fs');

var utils = {
  /**
  * @description Check if the user has provided the required options
  * @param {object} options - An options object should have two required options
  * @return {bool} bool representing if the provided options are valid
  */
  optionsAreValid: function (options) {
    return options.host !== undefined && options.dest !== undefined;
  },

  /**
  * @description Trim the cwd from the filepath, so if cwd is foo and filepath is foo/bar/bacon.jam,
  *     trim off the foo and only return the bar/bacon.jam
  * @param {string} filepath - filepath we want to trim cwd from
  * @param {string} cwd - the cwd to remove from the beginning of the path
  * @return {string} filepath with the cwd removed or the provided path if the cwd is not valid
  */
  trimCwd: function (filepath, cwd) {
    if (typeof cwd === 'string' && filepath.substr(0, cwd.length) === cwd) {
      filepath = filepath.substr(cwd.length);
    }
    return path.posix.normalize(filepath);
  },

  /**
  * @description Takes an array of file paths and returns an array of paths to use for pushing directories
  *     For example, 'foo/bar/baz/file.js' => ['foo', 'foo/bar', 'foo/bar/baz']
  * @param {string[]} filePaths - Array of filePaths, these will be decomposed into partial paths of
  *     directories necessary for the file to be successfully pushed
  * @return {string[]} returns an array of partial paths for required directories
  */
  getDirectoryPaths: function (filePaths) {
    var directoryPaths = [],
        regex = /\//g,
        partial,
        match;

    filePaths.forEach(function (filePath) {
      if (filePath.length !== 1) {
        filePath = path.posix.normalize(filePath);
        while((match = regex.exec(filePath)) !== null) {
          partial = filePath.slice(0, match.index);
          if (directoryPaths.indexOf(partial) < 0 && partial !== '') {
            directoryPaths.push(partial);
          }
        }
      }
    });

    return directoryPaths;
  },

  /**
  * @description Takes an array of file objects and returns an array of file paths, This will need to do a few things
  *     it will need to trim cwd from paths, use optional relative destinations, and avoid duplicates
  * @param {string} basePath - Base path provided by options.dest
  * @param {object[]} files - Array of file objects found by grunt
  * @return {object[]} returns a complete array of file path objects, {src: '...', dest: '...'}
  */
  getFilePaths: function (basePath, files) {
    var filePaths = [],
        destination;

    // Files must be of type array, if not, return an empty array
    if (Object.prototype.toString.call(files) !== '[object Array]') { return []; }

    files.forEach(function (file) {
      // For each src file we have
      file.src.forEach(function (filepath) {
        // Make sure the path is normalized
        filepath = path.posix.normalize(filepath);
        // Trim the cwd from the path to prepare it for the destination
        destination = utils.trimCwd(filepath, file.orig.cwd);
        // Set up the relative destination if one is provided
        if (file.orig.dest) {
          destination = path.posix.join(basePath, file.orig.dest, destination);
        } else {
          destination = path.posix.join(basePath, destination);
        }
        // If a files destination is not in the array, add the file, this matched on destination
        if (!utils.arrayContainsFile(filePaths, destination)) {
          filePaths.push({
            src: filepath,
            dest: destination
          });
        }

      }); // Inner for-each

    }); // Outer for-each

    return filePaths;
  },

  /**
  * @description Takes an array and a files destination path { src: '..', dest: '..' } and checks if the array contains it
  * @param {object[]} files - Array of FilePath Objects
  * @param {string} destination - Destination of the File
  * @return {boolean} whether or not the array of files contained a file with the destination
  */
  arrayContainsFile: function (files, destination) {
    return files.some(function (file) { return file.dest === destination; });
  },

  /**
  * @description Takes an array of file objects and returns an array of destinations
  * @param {object[]} files - Array of file objects found by grunt
  * @return {string[]} returns an array of destinations, the destinations for the files about to be pushed
  */
  getDestinations: function (files) {
    return files.map(function (file) { return file.dest; });
  },

  /**
  * @description Takes a cache and an array of file objects. Updates the cache and returns files that have been modified
  * @param {object} cache - Cache to update, simple Dictionary of type <string,string>(filename,mtime)
  * @param {object[]} files - Array of file objects found by grunt
  * @return {object<object<string, string>, object[]>} - returns the updated caches and a files object array containing changed files
  */
  updateCacheGetChanges: function (cache, files) {
    var stats, mtime;

    var changes = files.filter(function (file) {
      stats = fs.statSync(file.src);
      mtime = new Date(stats.mtime).getTime();

      if (cache[file.src] === undefined || cache[file.src] < mtime) {
        cache[file.src] = mtime;
        return true;
      } else {
        return false;
      }
    });

    return {
      cache: cache,
      files: changes
    };
  }

};

module.exports = utils;
