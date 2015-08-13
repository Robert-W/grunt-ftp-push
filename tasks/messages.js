module.exports = {
  connectionClosed: 'FTP connection closed!',
  anonymousLogin: 'Attempting anonymous login.',
  invalidRequirements: 'You did not provide the minimum requirements.  Please refer to the following documentation for information. https://github.com/Robert-W/grunt-ftp-push#required-options',
  authSuccess: function (user) { return user + ' successfully authenticated!'; },
  fileNotExist: function (path) { return 'Source file ' + path + ' not found.'; },
  directoryCreated: function (directory) { return directory + ' directory created successfully.'; },
  fileTransferFail: function (file, err) { return file + ' failed to transfer because ' + err; },
  fileTransferSuccess: function (file) { return file + ' transferred successfully.'; },
};
