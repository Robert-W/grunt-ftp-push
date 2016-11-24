module.exports = {
  invalidRequirements: 'You did not provide the minimum requirements.  Please refer to the following documentation for information. https://github.com/Robert-W/grunt-ftp-push#required-options',
  anonymousLogin: 'Attempting anonymous login.',
  connectionClosed: 'FTP connection closed!',
  noNewFiles: 'No new files to push. If you want to force push all your files, set incrementalUpdates to true in your options.',
  noFiles: 'No files detected. Please check your configuration.',
  directoryCreated: function (directory) { return directory + ' directory created successfully.'; },
  fileTransferFail: function (file, err) { return file + ' failed to transfer because ' + err; },
  fileTransferSuccess: function (file) { return file + ' transferred successfully.'; },
  fileNotExist: function (path) { return 'Source file ' + path + ' not found.'; },
  authFailure: function (user) { return 'Could not authenticate with ' + user; },
  authSuccess: function (user) { return user + ' successfully authenticated!'; },
  debug: function (msg) { return 'DEBUG: ' + msg; }
};
