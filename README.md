# grunt-ftp-push

> Deploy your files to a FTP server,

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
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### Options.Username
Type: `String` 
Default: `None`

Username for logging into the FTP server.

#### Password
Type: `String` 
Default: `None`

Password for logging into the FTP server.

#### host
Type: `String` 
Default: `None`

URL host of your FTP Server.

#### dest
Type: `String` 
Default: `None`

Destination of where you want your files pushed to, relative to the host.

#### port
Type: `Number` 
Default: `21`

Port for accessing the FTP server.

### Usage Examples

#### Default Options
In this example, the default options are used to set up the necessary components of pushing files to an FTP server. This is meant to be very basic, the files you specify in `files` will be pushed one by one to `host + dest`.

```js
grunt.initConfig({
  ftp_push: {
        options: {
          username: "{{Username}}",
          password: "{{Password}}",
          host: "sample.server.com",
          dest: "/html/test/",
          port: 21
        },
        files: [ // Enable Dynamic Expansion, Src matches are relative to this path, Actual Pattern(s) to match
          {expand: true,cwd: 'test',src: ['**/*']}
        ]
      }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
