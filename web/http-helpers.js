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

exports.serveAssets = function(res, asset, callback, isRedirect = false) {
  let urlPath;
  res.statusCode = 200;
  if (asset === '/' ) {
    urlPath = path.join(__dirname, '/public/index.html');
  } else if (asset === '/styles.css') {
    urlPath = path.join(__dirname, '/public/styles.css');
  } else if (asset === '/loading.html') {
    res.statusCode = 302;
    urlPath = path.join(__dirname, '/public/loading.html');
  } else if (isRedirect) {
    urlPath = path.join(__dirname, `../web/archives/sites/${asset}`);
  } else {
    res.statusCode = 404;
    res.end();
    return;
  }

  fs.readFile(urlPath, (err, data) => {
    callback(err, data);
  });

};
