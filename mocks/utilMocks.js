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
  }
};
