// var exec = require('child_process').exec;
// var Server = require('ftp-test-server');
// var expect = require('chai').expect;

// describe('Grunt local test using ftp-test-server', function () {
//
//   var myFtp = new Server();
//
//   myFtp.on('stdout', function (stdout) {
//     console.log(stdout.toString('utf8'));
//   });
//
//   myFtp.on('stderr', function (stderr) {
//     console.log(stderr.toString('utf8'));
//   });
//
//   myFtp.init({
//     user: 'local_user',
//     pass: '12345',
//     port: 3334
//   });
//
//   it('Should run \'grunt local\' and exit with status code 0', function (done) {
//
//     var task = exec('grunt local');
//
//     task.on('exit', function (code) {
//       expect(code).to.equal(0);
//       myFtp.stop();
//       done();
//     });
//
//   });
//
// });
