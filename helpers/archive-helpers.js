var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
};

exports.isUrlInList = function(url, callback) {
};

exports.addUrlToList = function(url, callback) {
};

exports.isUrlArchived = function(url, callback) {
  console.log('IN URLARCHIVED');
  const urlPath = path.join(__dirname, `../web/archives/sites${url}`);
  console.log('urlPath is', urlPath);

  // FIXME: Erase thru writeFileSync, this is for TESTING
  var fd = fs.openSync(path.join(__dirname, `../web/archives/sites/www.test.com`), 'w');
  fs.writeSync(fd, 'testtest');
  fs.closeSync(fd);

  // Write data to the file.
  fs.writeFileSync(path.join(__dirname, `../web/archives/sites/www.test.com`), 'testing');




  //FIXME WRONG URL, use urlPath, this is for testing
  fs.readFile(path.join(__dirname, `../web/archives/sites/www.test.com`), (err, data) => {
    console.log('readFile Done TEST DATA', data.toString());
    callback(err, data);
  });
};

exports.downloadUrls = function(urls) {
};
