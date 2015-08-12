var path = require('path');
console.log(path);

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
  *              trim off the foo and only return the bar/bacon.jam
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

  getFileObjects: function () {
    'use strict';
  },

  getDirectoryPaths: function () {
    'use strict';
  }

};
