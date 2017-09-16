const Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('underscore');
const rp = require('request-promise');

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

exports.readListOfUrls = function() {
  const urlPath = path.join(__dirname, '../web/archives/sites.txt');
  return fs.readFileAsync(urlPath)
          .then((data) => ( data.toString().split('\n') ))
          .catch((err) => ( err ));
};

exports.isUrlInList = function(url) {
  const urlPath = path.join(__dirname, '../web/archives/sites.txt');
  return fs.readFileAsync(urlPath)
          .then((data) => {
            const dataStr = data.toString();
            const dataArr = dataStr.split('\n');
            return dataArr.includes(url);
          })
          .catch((err) => ( err ));
};

exports.addUrlToList = function(url) {
  const urlPath = path.join(__dirname, '../web/archives/sites.txt');
  if (url.match(/^http\:\/\//gi)) {
    url = url.slice(7);
  }
  return fs.appendFileAsync(urlPath, url + '\n')
          .then(() => ( true ))
          .catch((err) => ( err ));
};

exports.isUrlArchived = function(url) {
  const urlPath = path.join(__dirname, `../web/archives/sites/${url}`);
  return fs.readFileAsync(urlPath)
          .then(() => ( true ))
          .catch(() => ( false ));
};

exports.downloadUrls = function(urls) {
  const urlPath = path.join(__dirname, '../web/archives/sites/');
  let counter = urls.length - 1;
  urls.forEach((url) => {
    if (url.length < 1) { return; }
    const openPromise = fs.openAsync(urlPath + url, 'w');
    const htmlPromise = rp('http://' + url)
                        .then((html) => {
                          return html;
                        })
                        .catch((err) => {
                          return err.error;
                        });

    Promise.join(htmlPromise, openPromise, (html, fd) => {
      if (html.toString().match(/ENOTFOUND/)) {
        console.log('BAD URL', url);

        counter--;
        if (counter === 0) {
          exports.clearUrlList();
        }
        fs.unlinkAsync(urlPath + url)
        .then (() => {
          return;
        });
      } else {
        fs.writeFileAsync(urlPath + url, html)
        .catch((err) => {
          console.error('error in downloading URLs', err);
        })
        .then(() => {
          return fs.closeAsync(fd);
        })
        .then(() => {
          counter--;
          if (counter === 0) {
            exports.clearUrlList();
          }
        });
      }
    });
  });
};

exports.clearUrlList = function() {
  const testFile = path.join(__dirname, '../web/archives/sites.txt');
  return fs.openAsync(testFile, 'w')
          .then((fd) => {
            return fs.closeAsync(fd);
          })
          .catch((err) => {
            console.error(err);
          });
};
