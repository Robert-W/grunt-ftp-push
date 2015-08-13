/*eslint-disable*/
module.exports = {
  optionsUsername: {
    host: 'sample.server.com',
    dest: '/html/test/',
    username: 'myUsername',
    password: 'myPassword',
    debug: true
  },
  optionsAuthKey: {
    authKey: 'serverA',
    host: 'sample.server.com',
    dest: '/html/test/',
    port: 21
  },
  optionsInvalid: {
    authKey: 'serverA',
    dest: '/html/test/',
    port: 21
  },
  validCwdTest: {
    filepath: 'foo/bar/baz/index.js',
    cwd: 'foo/bar',
    result: '/baz/index.js'
  },
  invalidCwdTest: {
    filepath: 'foo/bar/baz/index.js',
    cwd: 'baz/ball',
    result: 'foo/bar/baz/index.js'
  },
  arrayMatch: {
    files: [{
      'path': 'test/jsftp/Test.txt',
      'dest': '/html/test/jsftp/Test.txt'
    }, {
      'path': 'test/jsftp/jsftpSpec.js',
      'dest': '/html/test/jsftp/jsftpSpec.js'
    }, {
      'path': 'tasks/utils.js',
      'dest': '/html/test/test/utils.js'
    }],
    uniqueDest: '/html/test/jsftp/Dispatcher.js',
    duplicateDest: '/html/test/jsftp/Test.txt'
  },
  dirPath: {
    files: [
      '/test/jsftp/Tests.txt',
      '/test/jsftp/jsftpSpec.js',
      '/test/nested/another/sample.js'
    ],
    expected: [
      '/test',
      '/test/jsftp',
      '/test/nested',
      '/test/nested/another'
    ]
  },
  /*
    We should never encounter bad filepaths like this, but just in case, lets make sure we can handle it.
    This should create a situation where empty strings or duplicates could find their way in
  */
  dirPathBad: {
    files: [
      '/foo//bar/baz/doo/index.js',
      '/foo/bar/baz/doo/index.js',
      '//foo/wat/baz/doo/index.js'
    ],
    expected: [
      '/foo',
      '/foo/bar',
      '/foo/bar/baz',
      '/foo/bar/baz/doo',
      '/foo/wat',
      '/foo/wat/baz',
      '/foo/wat/baz/doo',
    ]
  }
};
