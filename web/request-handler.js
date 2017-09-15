var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const path = require('path');
const urlMod = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const { url, method, headers } = req;
  let statusCode;
  const parsedURL = urlMod.parse(url, true);

  if (url === '/' && method === 'GET') {
    res.statusCode = 200;
    const urlPath = path.join(__dirname, '/public/index.html'); //TODO Use archive.paths.siteAssets
    fs.readFile(urlPath, (err, data) => {
      if (err) { throw err; }
      res.end(data.toString());
    });
  } else if (method === 'GET') {
    const cb = (err, data) => {
      if (err) {
        console.log('in cb error');
        res.statusCode = 404;
        res.end();
      }
      const urlPath = path.join(__dirname, `/archives/sites${url}`);
      fs.readFile(urlPath, (err, data) => {
        if (err) { throw err; }
        res.statusCode = 200;
        res.end(data.toString());
      });
    };

    console.log('GETTING FILE...', url);

    archive.isUrlArchived(url, cb);
  } else {
    res.end(archive.paths.list);
  }


};
