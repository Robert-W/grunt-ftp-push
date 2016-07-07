var path = require('path');
var fs = require('fs');

var cachePath = path.join(__dirname, '_filecache.json');

module.exports = {
  get: function () { return JSON.parse(fs.readFileSync(cachePath, 'utf-8')); },
  set: function (cache) { fs.writeFileSync(cachePath, JSON.stringify(cache)); }
};
