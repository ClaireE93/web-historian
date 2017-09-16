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
  let urlPath;
  res.statusCode = 200;
  if (asset === '/' ) {
    urlPath = path.join(__dirname, '/public/index.html'); //TODO Use archive.paths.siteAssets
  } else if (asset === '/styles.css') {
    urlPath = path.join(__dirname, '/public/styles.css'); //TODO Use archive.paths.siteAssets
  } else if (asset === '/loading.html') {
    res.statusCode = 302;
    urlPath = path.join(__dirname, '/public/loading.html'); //TODO Use archive.paths.siteAssets
  } else {
    // res.statusCode = 302;
    urlPath = path.join(__dirname, `../web/archives/sites/${asset}`);
  }

  fs.readFile(urlPath, (err, data) => {
    callback(err, data);
  });

};





// As you progress, keep thinking about what helper functions you can put here!
