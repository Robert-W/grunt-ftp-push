# grunt-ftp-push

> Deploy your files to a FTP server <br>
> Notice: Currently SFTP is not supported

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

#### password
Type: `String`<br>
Default: `None`<br>
Required: false

If no authKey and .ftpauth file is provided, you can specify password here.

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
The only option that has a default is the port, which is 21.  Currently the `host` and `dest` options are the only two required for this plugin to function correctly.  If any of the required options are omitted, the plugin will abort with a warning informing you that you did not specify all the necessary requirements.

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
## Dependencies

This plugin uses Sergi Mansilla's <a href="https://github.com/sergi/jsftp">jsftp</a> node.js module.

## Coming Soon
Adding in list of files to exclude from the upload.<br>
Ability to push to multiple destinations with different sets of files in one target<br>
Possibly adding in support for SFTP

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
<ul>
<li>2014/07/20 - v 0.2.2 
<ul>
<li>Fixes for getting credentials correctly.</li><li>Creating directories correctly from dest if they don't exist.</li><li>Handling '/' appropriately in all cases.</li><li>Better error handling, restructured code, and more detailed comments.</li><li>Upgraded to latest jsftp(v 1.3.1). <a target='_blank' href='https://github.com/Robert-W/grunt-ftp-push/issues/8'>#8</a></li><li>Updated documentation for username and password.</li>
</ul>
</li>
<li>2014/07/10 - v 0.2.1 Fixed issue from latest patch where it was not correctly creating directories in provided filepaths from patterns. As well as <a href='https://github.com/Robert-W/grunt-ftp-push/issues/7' target='_blank'>#7</a> & <a href='https://github.com/Robert-W/grunt-ftp-push/issues/9' target='_blank'>#9</a>&nbsp;</li>
<li>2014/07/03 - v 0.2.0 &nbsp;<a href='https://github.com/Robert-W/grunt-ftp-push/issues/6' target='_blank'>#6</a>&nbsp; Fixed issue with pushing files from root directory when cwd is set to '.' or './'</li>
</ul>
