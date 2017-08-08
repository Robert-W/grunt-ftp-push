/**
* @author Robert Winterbottom <Robbie.Winterbottom@gmail.com>
* Description:
* 	- Push a file called Test.txt to the root of remote host and then immediately delete it
* 	- OVH.com is erroring out, receiving a pasv command way too early when
			uploading multiple files. Repeat this test numerous times while
			running jsftp in debug mode to try to recreate the error.

* Directions:
* 1) Enter your username, password, and host (use undefined for anonymous logins)
* 2) npm run ovh-test
*/

var defaults = {
	username: 'user',
	password: 'pass',
	host: 'sample.server.com'
};

// How many times to push the file, OVH does not always fail on first push and seems to randomly fail after a few files
// Increase this number to increase the number of iterations the test pushing and deleting a file
// NOTE: You should see 2 successful assertions per iteration when tests are complete
var iterations = 25;

describe('Grunt Plugin - FTP Push - JSFTP test for troublesome hosts', function () {

	var expect = require('chai').expect,
			grunt = require('grunt'),
			Ftp = require('jsftp'),
			server;

	// Connect to the server
	beforeEach(function () {

		server = new Ftp({
			user: defaults.username,
			pass: defaults.password,
			host: defaults.host,
			debugMode: true,
			port: 21
		});

		server.on('jsftp_debug', function(eventType, data) {
      console.log('DEBUG: ', eventType);
      console.log(JSON.stringify(data, null, 2));
    });

	});

	// Destroy the connection
	afterEach(function () {
		server.destroy();
	});

	it('Should push a file and remove the file multiple times successfully.', function (done) {

		var filename = 'Test.txt';
		var localPath = [__dirname, '/', filename].join('');
		// If you don't want to push to root directory, edit remotePath,
		// make sure dirs are created though, this test does not create directories
		var remotePath = filename;
		var buffer = grunt.file.read(localPath, { encoding: null });
		var complete, run;

		complete = function () {
			if (--iterations > 0) {
				run();
			} else {
				done();
			}
		};

		run = function() {
			server.put(buffer, remotePath, function (err) {
				expect(err).to.be.false;
				server.raw.dele(remotePath, function (delErr) {
					expect(delErr).to.be.null;
					complete();
				});
			});
		};

		run();

	});

});
