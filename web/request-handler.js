var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const path = require('path');
const urlMod = require('url');
const httpHelpers = require('./http-helpers');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  const { url, method, headers } = req;
  console.log(`Serving ${method} for url: ${url}`);
  let statusCode;
  const parsedURL = urlMod.parse(url, true);

  const staticFileCb = (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.writeHead(res.statusCode, httpHelpers.headers);
      res.end(data.toString());
    }
  };

  const addUrlCb = (err) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.statusCode = 302;
      res.end();
    }
  };

  if (method === 'GET') {

    httpHelpers.serveAssets(res, url, staticFileCb);

  } else if (method === 'POST') {

    if (url !== '/') {
      res.statusCode = 401;
      res.end();
      return;
    }

    let body = [];
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();

      const urlToAdd = body.split('=')[1];
      const handleUrlInListResponse = (isInList) => {
        if (isInList) {
          httpHelpers.serveAssets(res, '/loading.html', staticFileCb);
        } else {
          httpHelpers.serveAssets(res, '/', staticFileCb);
          archive.addUrlToList(urlToAdd, addUrlCb);
        }
      };

      const handleUrlInArchiveRepsonse = (isInArchive) => {
        if (isInArchive) {
          httpHelpers.serveAssets(res, urlToAdd, staticFileCb, true);
        } else {
          archive.isUrlInList(urlToAdd, handleUrlInListResponse);
        }
      };

      archive.isUrlArchived(urlToAdd, handleUrlInArchiveRepsonse);

    });

  } else {
    res.end(archive.paths.list);
  }




};
