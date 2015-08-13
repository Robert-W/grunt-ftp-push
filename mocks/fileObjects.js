/*eslint-disable*/
module.exports = {
  'test': {
    'files': [{
      "src": ['test/jsftp'],
      "orig": {
        "expand": true,
        "cwd": 'test',
        "src": ['**/*']
      },
      "dest": 'jsftp'
    }, {
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
        "src": ['test/nested'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'nested'
    }, {
        "src": ['test/nested/another'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'nested/another'
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
      'path': 'test/jsftp/Test.txt',
      'dest': '/html/test/jsftp/Test.txt'
    }, {
      'path': 'test/jsftp/jsftpSpec.js',
      'dest': '/html/test/jsftp/jsftpSpec.js'
    }, {
      'path': 'test/nested/another/sample.js',
      'dest': '/html/test/nested/another/sample.js'
    }, {
      'path': 'tasks/ftp_push.js',
      'dest': '/html/test/test/ftp_push.js'
    }, {
      'path': 'tasks/utils.js',
      'dest': '/html/test/test/utils.js'
    }],
    'base': '/html/test/'
  }
};
