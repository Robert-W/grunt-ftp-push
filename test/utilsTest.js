var fileMocks = require('./mocks/fileObjects');
var mocks = require('./mocks/utilMocks');
var utils = require('../tasks/utils');
var cache = require('../tasks/cache');
var expect = require('chai').expect;
var fs = require('fs');

describe('ftp_push - utils.optionsAreValid', function () {
  'use strict';

  it('should return true if host and dest are in the provided options', function () {
    expect(utils.optionsAreValid(mocks.optionsUsername)).to.be.true;
    expect(utils.optionsAreValid(mocks.optionsAuthKey)).to.be.true;
  });

  it('should return false if either host or dest are not in the provided options', function () {
    expect(utils.optionsAreValid(mocks.optionsInvalid)).to.be.false;
  });

});

describe('ftp_push - utils.trimCwd', function () {
  'use strict';

  it('should return the filepath minus the cwd provided if the cwd provided is at the beginning of the filepath', function () {
    expect(utils.trimCwd(mocks.validCwdTest.filepath, mocks.validCwdTest.cwd)).to.equal(mocks.validCwdTest.result);
  });

  it('should return the filepath if the cwd provided is not at the beginning of the path', function () {
    expect(utils.trimCwd(mocks.invalidCwdTest.filepath, mocks.invalidCwdTest.cwd)).to.equal(mocks.invalidCwdTest.result);
  });

  it('should return the filepath if a cwd is not provided or undefined', function () {
    expect(utils.trimCwd(mocks.invalidCwdTest.filepath)).to.equal(mocks.invalidCwdTest.result);
  });

});

describe('ftp_push - utils.getFilePaths', function () {
  'use strict';

  it('should return an array of normalized filepaths', function () {
    var results = utils.getFilePaths(fileMocks.test.base, fileMocks.test.files);
    expect(results.length).to.equal(fileMocks.test.paths.length);
    results.forEach(function (file) {
      expect(file.src).to.exist;
      expect(file.dest).to.exist;
      expect(utils.arrayContainsFile(fileMocks.test.paths, file.dest)).to.be.true;
    });
  });

  it('should accomodate relative destinations specified at the file level to be included in paths', function () {
    var file = fileMocks.test.files[4];
    var expected = fileMocks.test.paths[4];
    var result = utils.getFilePaths(fileMocks.test.base, [file])[0];

    expect(result.dest).to.equal(expected.dest);
    expect(result.dest).to.not.equal(expected.badPath);
  });

  it('should remove the current working directory from the filepath', function () {
    var file = fileMocks.test.files[0];
    var result = utils.getFilePaths(fileMocks.test.base, [file])[0];
    // First remove the base from the path, as we dont need to test the basepath, just the relative file path
    // and the basepath may contain a directory similar to the cwd which would skew the results
    var relativePath = result.dest.replace(fileMocks.test.base, '');
    expect(relativePath.search(file.orig.cwd)).to.equal(-1);
  });

  it('should not contain any duplicates', function () {
    var results = utils.getFilePaths(fileMocks.test.base, fileMocks.test.files);
    expect(results.length).to.equal(fileMocks.test.paths.length);

    var allUnique = results.every(function (file, firstIndex) {
        return results.every(function (file2, secondIndex) {
          // Return true if the destinations are not the same or if the index
          // is the same because that means its the same file
          return file.dest !== file2.dest || firstIndex === secondIndex;
        });
    });
    expect(allUnique).to.be.true;
  });

});

describe('ftp_push - utils.getDirectoryPaths', function () {
  'use strict';

  // for example, /foo/bar/baz/index.js should return ['/foo', '/foo/bar', '/foo/bar/baz']
  it('should return an array of directories partial paths', function () {
    var dirPaths = utils.getDirectoryPaths(mocks.dirPath.files);
    // Should be the same length
    expect(dirPaths.length).to.equal(mocks.dirPath.expected.length);
    // Each item in the dirPaths should also be in mocks.dirPath.expected
    var allPresent = dirPaths.every(function (path) {
      return mocks.dirPath.expected.indexOf(path) > -1;
    });
    expect(allPresent).to.be.true;
  });

  it('should not contain any duplicates', function () {
    var dirPaths = utils.getDirectoryPaths(mocks.dirPathBad.files);
    // Should be the same length
    expect(dirPaths.length).to.equal(mocks.dirPathBad.expected.length);
    // Each items index and lastIndex should be the same, if there not, then there is a duplicate
    var allUnique = dirPaths.every(function (path) {
      return dirPaths.indexOf(path) === dirPaths.lastIndexOf(path);
    });
    expect(allUnique).to.be.true;
  });

  it('should not contain any empty paths', function () {
    var dirPaths = utils.getDirectoryPaths(mocks.dirPathBad.files);
    // Should be the same length
    expect(dirPaths.length).to.equal(mocks.dirPathBad.expected.length);
    // There should not be a single entry where path === ''
    var noBlanks = dirPaths.every(function (path) {
      return path !== '';
    });
    expect(noBlanks).to.be.true;
  });

});

describe('ftp_push - utils.arrayContainsFile', function () {
  'use strict';

  it('should return true when passed a destination and an array of files containing that destination', function () {
    expect(utils.arrayContainsFile(mocks.arrayMatch.files, mocks.arrayMatch.duplicateDest)).to.be.true;
  });

  it('should return false when passed a destination and an array of files that does not have that destination', function () {
    expect(utils.arrayContainsFile(mocks.arrayMatch.files, mocks.arrayMatch.uniqueDest)).to.be.false;
  });

});

describe('ftp_push - utils.getChangesAndUpdateCache', function () {
  'use strict';
  /**
  * TODO:
  * - Add documentation in README
  * - Add documentation in Code
  * - Make option so this feature can be turned on or off
  * - Make this feature turned on by default
  */

  beforeEach(function () {
    // Reset the cache
    cache.set({});
  });

  it('should write each file\'s mtime in the cache', function () {
    var localCache = cache.get();
    var fobjects = [
      { src: '.editorconfig', dest: '.editorconfig'},
      { src: '.gitignore', dest: '.gitignore'},
      { src: 'LICENSE-MIT', dest: 'LICENSE-MIT'}
    ];
    var files = utils.updateCacheGetChanges(localCache, fobjects).files;
    var knownMTimes = {
      '../.editorconfig': 1441828996000,
      '../.gitignore': 1441828996000,
      '../LICENSE-MIT': 1439475864000
    };

    expect(files.length).to.equal(fobjects.length);
    expect(files.every(function (file, i) { return file === fobjects[i].src; }));
    expect(files.every(function (file) { return cache[file] === knownMTimes[file]; }));
  });

  it('should return a list of paths with new mtime\'s and the updated cache', function (done) {
    var localCache = cache.get();
    // These first three should not change, add a test file, currently needs to be manually updated
    var fobjects = [
      { src: '.editorconfig', dest: '.editorconfig'},
      { src: '.gitignore', dest: '.gitignore'},
      { src: 'LICENSE-MIT', dest: 'LICENSE-MIT'},
      { src: 'files/js/alert.js', dest: 'files/js/alert.js'}
    ];
    var updates = utils.updateCacheGetChanges(localCache, fobjects);
    var newTimestamp = new Date(Date.now());

    // Save the original times
    var times = {
      '.editorconfig': updates.cache['.editorconfig'],
      '.gitignore': updates.cache['.gitignore'],
      'LICENSE-MIT': updates.cache['LICENSE-MIT'],
      'files/js/alert.js': updates.cache['files/js/alert.js']
    };

    // Update the cache
    cache.set(updates.cache);

    // We should have four files since none are present in the cache
    expect(updates.files.length).to.equal(fobjects.length);
    // Let's modify the alert.js file
    fs.utimes('files/js/alert.js', newTimestamp, newTimestamp, function () {
      // Now get the updates
      updates = utils.updateCacheGetChanges(cache.get(), fobjects);
      // and see if we only have a single file now
      expect(updates.files.length).to.equal(1);
      // and see if the cache was properly updated
      expect(updates.cache['files/js/alert.js']).to.be.above(times['files/js/alert.js']);
      // These were not modified so the cache should be the same
      expect(updates.cache['.editorconfig']).to.equal(times['.editorconfig']);
      expect(updates.cache['.gitignore']).to.equal(times['.gitignore']);
      expect(updates.cache['LICENSE-MIT']).to.equal(times['LICENSE-MIT']);
      done();
    });

  });


});
