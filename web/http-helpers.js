var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  let statusCode;
  if (asset === '/' ) {
    res.statusCode = 200;
    const urlPath = path.join(__dirname, '/public/index.html'); //TODO Use archive.paths.siteAssets
    fs.readFile(urlPath, (err, data) => {
      callback(err, data); // callback: response.end(data.toString())
    });
  } else if (asset === '/styles.css') {
    res.statusCode = 200;
    const urlPath = path.join(__dirname, '/public/styles.css'); //TODO Use archive.paths.siteAssets
    fs.readFile(urlPath, (err, data) => {
      callback(err, data); // callback: response.end(data.toString())
    });

  } else {
    archive.isUrlArchived(asset, callback);
  }

};





// As you progress, keep thinking about what helper functions you can put here!
