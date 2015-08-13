/*eslint-disable*/
module.exports = {
  'test': {
    'files': [{
        "src": ['test/jsftp/Test.txt'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'jsftp/Test.txt'
    }, {
        "src": ['test/jsftp/jsftpSpec.js'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'jsftp/jsftpSpec.js'
    }, {
        "src": ['test/nested/another/sample.js'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'nested/another/sample.js'
    }, {
        "src": ['tasks/ftp_push.js'],
        "dest": 'tasks/ftp_push.js',
        "orig": {
            "expand": true,
            "cwd": 'tasks',
            "src": ['**/*'],
            "dest": 'test/'
        }
    }, {
        "src": ['tasks/utils.js'],
        "dest": 'tasks/utils.js',
        "orig": {
            "expand": true,
            "cwd": 'tasks',
            "src": ['**/*'],
            "dest": 'test/'
        }
    }],
    'paths': [{
      'src': 'test/jsftp/Test.txt',
      'dest': '/html/test/jsftp/Test.txt'
    }, {
      'src': 'test/jsftp/jsftpSpec.js',
      'dest': '/html/test/jsftp/jsftpSpec.js'
    }, {
      'src': 'test/nested/another/sample.js',
      'dest': '/html/test/nested/another/sample.js'
    }, {
      'src': 'tasks/ftp_push.js',
      'dest': '/html/test/test/ftp_push.js'
    }, {
      'src': 'tasks/utils.js',
      'dest': '/html/test/test/utils.js',
      // This wont normally be in the results, but will use this to test to make sure the path is correct
      'badPath': '/html/test/tasks/utils.js'
    }],
    'base': '/html/test/'
  }
};
