var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const path = require('path');
const urlMod = require('url');
const httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const { url, method, headers } = req;
  let statusCode;
  const parsedURL = urlMod.parse(url, true);

  if (method === 'GET') {
    const cb = (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end();
      } else {
        res.statusCode = 200;
        res.end(data.toString());
      }
    };

    httpHelpers.serveAssets(res, url, cb);
  } else {
    res.end(archive.paths.list);
  }
};
