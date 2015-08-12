var path = require('path');

module.exports = {
  /**
  * @description Check if the user has provided the required options
  * @param {object} options - An options object should have two required options
  * @return {bool} bool representing if the provided options are valid
  */
  optionsAreValid: function (options) {
    'use strict';
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
    'use strict';
    if (typeof cwd === 'string' && filepath.substr(0, cwd.length) === cwd) {
      filepath = filepath.substr(cwd.length);
    }
    return filepath;
  },

  /**
  * @description Takes an array of file objects and returns an array of paths to use for pushing directories
  *     For example, 'foo/bar/baz/file.js' => ['foo', 'foo/bar', 'foo/bar/baz']
  * @param {array} filePaths - Array of filePaths, these will be decomposed into partial paths of
  *     directories necessary for the file to be successfully pushed
  * @return {array} returns an array of partial paths for required directories
  */
  getDirectoryPaths: function (filePaths) {
    'use strict';
    var directoryPaths = [],
        regex = /\//g,
        partial,
        match;

    filePaths.forEach(function (filePath) {
      if (filePath.length !== 1) {
        while((match = regex.exec(filePath)) !== null) {
          partial = filePath.slice(0, match.index);
          if (directoryPaths.indexOf(partial) < 0) {
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
  * @param {array} files - Array of file objects found by grunt
  * @return {array} returns a complete array of file paths that will be pushed over ftp
  */
  getFilePaths: function (files) {
    'use strict';
    console.log(files);
  }

};
