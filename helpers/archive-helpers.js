var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, './archives/sites'),
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
  const urlPath = path.join(__dirname, `../web/archives/sites.txt`);
  fs.readFile(urlPath, (err, data) => {
    if (err) { throw err; }
    callback(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  const urlPath = path.join(__dirname, `../web/archives/sites.txt`);
  fs.readFile(urlPath, (err, data) => {
    if (err) { throw err; }
    const dataStr = data.toString();
    const dataArr = dataStr.split('\n');
    callback(dataArr.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  const urlPath = path.join(__dirname, `../web/archives/sites.txt`);
  fs.appendFile(urlPath, url + '\n', (err) => {
    callback(err);
  });
};

exports.isUrlArchived = function(url, callback) {
  const urlPath = path.join(__dirname, `../web/archives/sites/${url}`);
  fs.readFile(urlPath, (err, data) => {
    err ? callback(false) : callback(true);
  });
};

exports.downloadUrls = function(urls) {
  const urlPath = path.join(__dirname, `../web/archives/sites/`);
  urls.forEach((url) => {
    // if (!url.startsWith('http://')) {
    //   url = 'http://' + url;
    // }
    request('http://' + url, function(error, response, html){
      if(!error){
        fs.open(urlPath + url, 'w', (err, fd) => {
          fs.writeFile(urlPath + url, html, (err) => {
            if (err) { throw err; }
            fs.close(fd, () => {
              return;
            });
          });
        });

      } else {
        console.log('ERROR!', error);
      }
    });

  });

};
