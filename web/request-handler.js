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
      console.log('SENDING 302');
      res.statusCode = 302;
      res.end();
    }
  };

  if (method === 'GET') {

    httpHelpers.serveAssets(res, url, staticFileCb);

  } else if (method === 'POST') {

    console.log('in post');

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
          archive.addUrlToList(urlToAdd, addUrlCb);
        }
      };

      const handleUrlInArchiveRepsonse = (isInArchive) => {
        if (isInArchive) {
          httpHelpers.serveAssets(res, urlToAdd, staticFileCb);
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
