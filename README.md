# grunt-ftp-push  [![Build Status](https://travis-ci.org/Robert-W/grunt-ftp-push.svg?branch=master)](https://travis-ci.org/Robert-W/grunt-ftp-push)

> Deploy your files to a FTP server <br>
> Notice: Currently SFTP is not supported

## This repo is publically maintained
> The orignal owner is no longer using Grunt and does not have time to maintain this anymore. If anyone is interested in maintaining this and taking ownership, please open an issue and let us know that you'd like to be added as a contributor.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ftp-push --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ftp-push');
```

## The "ftp_push" task

### Overview
In your project's Gruntfile, add a section named `ftp_push` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ftp_push: {
    your_target: {
      options: {
		authKey: "serverA",
    	host: "sample.server.com",
    	dest: "/html/test/",
    	port: 21
      },
      files: [
        {
          expand: true,
          cwd: '.',
          src: [
            ".gitignore",
            "package.json",
            "README.md",
            "test/**"
          ]
        }
      ]
    }
  }
})
```

### Options

#### authKey
Type: `String`<br>
Default: `None`<br>
Required: false

Name of authKey that will be used for your credentials to access the FTP server.  This name should match the name of the credentials you want to use in the `.ftpauth` file.

#### host
Type: `String`<br>
Default: `None`<br>
Required: true

URL host of your FTP Server.

#### dest
Type: `String`<br>
Default: `None`<br>
Required: true

Destination of where you want your files pushed to, relative to the host.

#### port
Type: `Number`<br>
Default: `21`<br>
Required: false

Port for accessing the FTP server.

#### username
Type: `String`<br>
Default: `None`<br>
Required: false

If no authKey and .ftpauth file is provided, you can specify username here. 

You also have the option of specifying the username in your run command. This is especially useful when
you have multiple users on your project, or you don't wish to store the credentials. 

Gruntfile.js:
```js
username: grunt.option('ftp-user') || 'anonymous',
```

Command line:
```shell
grunt --ftp-user=myUser
```

#### password
Type: `String`<br>
Default: `None`<br>
Required: false

If no authKey and .ftpauth file is provided, you can specify password here.

You also have the option of specifying the password in your run command. This is especially useful when
you have multiple users on your project, or you don't wish to store the credentials. 

Gruntfile.js:
```js
password: grunt.option('ftp-pass') || '@anonymous',
```

Command line:
```shell
grunt --ftp-pass=myPassWord1
```

#### keepAlive
Type: `Number`<br>
Default: `60000`<br>
Required: false

Duration of JSFTP's keep alive to avoid session timeouts.

#### debug
Type: `Boolean`<br>
Default: `false`<br>
Required: false

Enable debug mode for the JSFTP module to allow for verbose console messages.

#### incrementalUpdates
Type: `Boolean`<br>
Default: `true`<br>
Required: false

Allows for files to be incrementally pushed based on their modified times.

#### hideCredentials
Type: `Boolean`<br>
Default: `true`<br>
Required: false

Does not show credentials in the console output. NOTE: debug mode runs jsftp in debug mode and this has no affect on that.

### Usage Examples

#### Sample .ftpauth file

This file should be named `.ftpauth` and be in the same directory as your `Gruntfile.js`.  It is a JSON object with an "authKey" that has a username and password for it's value. Use the following as a guide for setting up your file.

```js
{
	"serverA":{
		"username":"myUserName@gmail.com",
		"password":"password123456"
	},
	"serverB":{
  		"username":"myOtherUsername@gmail.com",
  		"password":"12345Pass"
  	}
}
```

#### Required Options
Currently the `host` and `dest` options are the only two required for this plugin to function correctly.  If any of the required options are omitted, the plugin will abort with a warning informing you that you did not specify all the necessary requirements.

#### Optional Options
In your options, you may choose not to set up an .ftpauth file and not have an authKey present in your options.  You will probably then need to specify the username and password in the options object instead.  If you don't, the plugin will attempt to use an anonymous login.

Specifying the username and password within the options object would look like the following:
```js
options: {
	username: "myUsername",
	password: "myPassword",
    host: "sample.server.com",
    dest: "/html/test/",
    port: 21
}
```
#### Extras
You can now specify a destination inside your files objects like so:
```js
{expand: true,cwd: 'test',src: ['**/*']},
{expand: true,cwd: 'tasks',src: ['**/*'], dest: 'test/' }
```
This will allow you to configure where you push your code in case you want to push to a diretory structure that is different from your local one.  The dest here <strong>MUST</strong> be relative to the root destination.

## Dependencies
This plugin uses Sergi Mansilla's <a href="https://github.com/sergi/jsftp">jsftp</a> node.js module.

## Coming Soon
Adding in Unit Tests for my sanity<br>
More Examples in the README to show different ways of using it<br>
Possibly adding in support for SFTP

## Contributing
Please add unit tests in the root of the test folder for any new or changed functionality and please try to make sure that `npm test` will pass before submitting a pull request.

## Release History
<ul>
<li>2017/08/08 - v 1.2.1 Updated jsftp version to 2.0.0</li>
<li>2016/11/23 - v 1.2.0 Updated Grunt version to 1.0.0</li>
<li>2016/07/07 - v 1.1.0 New feature, added incremental updates.</li>
<li>2016/03/28 - v 1.0.0 Updated release version to 1.0.0 since this has been stable for a little while.</li>
<li>2016/01/13 - v 0.4.4 Added code similar to PR [#41 Hide Credentials](https://github.com/Robert-W/grunt-ftp-push/pull/41) as a way to hide username in output for CI.</li>
<li>2015/09/24 - v 0.4.3 Merged updates from [#36 - Use path.posix for ftp paths](https://github.com/Robert-W/grunt-ftp-push/pull/36) for path operations not already using posix.</li>
<li>2015/09/03 - v 0.4.2 Using path.posix instead of just path, updated tasks to pass linting, added local ftp-server for more testing.</li>
<li>2015/09/03 - v 0.4.1 Swapped out jest for mocha and chai due to windows compatibility issues.</li>
<li>2015/09/03 - v 0.4.0 Several minor bug fixes, added unit tests, code cleanup, and now using nodes path module.</li>
<li>2015/06/25 - v 0.3.6 Merged updates from [#25 - De-Duplicate destination directories](https://github.com/Robert-W/grunt-ftp-push/pull/25) </li>
<li>2015/05/20 - v 0.3.4 Merged fix for empty folder structure being created. [#24](https://github.com/Robert-W/grunt-ftp-push/pull/24) </li>
<li>2015/01/15 - v 0.3.2  Added debug option, updated readme, updated jsftp to 1.3.9</li>
<li>2015/01/13 - v 0.3.0  Minor typo caused patch to work incorrectly</li>
<li>2015/01/13 - v 0.2.8  Patch for deeply nested files throwing errors</li>
<li>2014/12/22 - v 0.2.6  Added in option for keepAlive, default is 60000 (60 seconds), added in option for multiple destinations specified for each file object provided, if no dest is provided, it defaults to the dest specified in the options [#4](https://github.com/Robert-W/grunt-ftp-push/issues/4) & [#13](https://github.com/Robert-W/grunt-ftp-push/issues/13)
</li>
<li>2014/07/24 - v 0.2.4  Fixed issue introduced with latest fix, added fix to remove cwd from path of file being pushed so they are pushed to the expected location.  Other minor fixes and enhancements.
</li>
<li>2014/07/20 - v 0.2.2
<ul>
<li>Fixes for getting credentials correctly.</li><li>Creating directories correctly from dest if they don't exist.</li><li>Handling '/' appropriately in all cases.</li><li>Better error handling, restructured code, and more detailed comments.</li><li>Upgraded to latest jsftp(v 1.3.1). [#8](https://github.com/Robert-W/grunt-ftp-push/issues/8) </li><li>Updated documentation for username and password.</li>
</ul>
</li>
<li>2014/07/10 - v 0.2.1 Fixed issue from latest patch where it was not correctly creating directories in provided filepaths from patterns. As well as [#7](https://github.com/Robert-W/grunt-ftp-push/issues/7) & [#9](https://github.com/Robert-W/grunt-ftp-push/issues/9)&nbsp;</li>
<li>2014/07/03 - v 0.2.0 &nbsp;[#6](https://github.com/Robert-W/grunt-ftp-push/issues/6)&nbsp; Fixed issue with pushing files from root directory when cwd is set to '.' or './'</li>
</ul>
