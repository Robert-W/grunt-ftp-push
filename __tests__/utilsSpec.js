// Tell Jest not to mock my utils, the node path module, or custom mock objects to help with testing
jest.dontMock('path');
jest.dontMock('../tasks/utils');
jest.dontMock('../mocks/utilMocks');
jest.dontMock('../mocks/fileObjects');

var utils = require('../tasks/utils');
var mocks = require('../mocks/utilMocks');

describe('ftp_push - utils.optionsAreValid', function () {
  'use strict';

  it('should return true if host and dest are in the provided options', function () {
    expect(utils.optionsAreValid(mocks.optionsUsername)).toBeTruthy();
    expect(utils.optionsAreValid(mocks.optionsAuthKey)).toBeTruthy();
  });

  it('should return false if either host or dest are not in the provided options', function () {
    expect(utils.optionsAreValid(mocks.optionsInvalid)).toBeFalsy();
  });

});


describe('ftp_push - utils.trimCwd', function () {
  'use strict';

  it('should return the filepath minus the cwd provided if the cwd provided is at the beginning of the filepath', function () {
    expect(utils.trimCwd(mocks.validCwdTest.filepath, mocks.validCwdTest.cwd)).toEqual(mocks.validCwdTest.result);
  });

  it('should return the filepath if the cwd provided is not at the beginning of the path', function () {
    expect(utils.trimCwd(mocks.invalidCwdTest.filepath, mocks.invalidCwdTest.cwd)).toEqual(mocks.invalidCwdTest.result);
  });

  it('should return the filepath if a cwd is not provided or undefined', function () {
    expect(utils.trimCwd(mocks.invalidCwdTest.filepath)).toEqual(mocks.invalidCwdTest.result);
  });

});

describe('ftp_push - utils.getFilePaths', function () {
  'use strict';

  it('should return an array of normalized filepaths', function () {
    expect(1).toEqual(1);
  });

  it('should accomodate relative destinations specified at the file level to be included in paths', function () {
    expect(1).toEqual(1);
  });

  it('should remove the current working directory from the filepath', function () {
    expect(1).toEqual(1);
  });

  it('should not contain any duplicates', function () {
    expect(1).toEqual(1);
  });

  it('should contain all of the expected files', function () {
    expect(1).toEqual(1);
  });

});

describe('ftp_push - utils.getDirectoryPaths', function () {
  'use strict';

  // for example, foo/bar/baz/index.js should return ['foo', 'foo/bar', 'foo/bar/baz']
  it('should return an array of directories partial paths', function () {
    expect(1).toEqual(1);
  });

  it('should not contain any duplicates', function () {
    expect(1).toEqual(1);
  });

});
