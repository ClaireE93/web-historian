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

      archive.isUrlArchived(urlToAdd)
              .then((isInArchive) => {
                if (isInArchive) {
                  httpHelpers.serveAssets(res, urlToAdd, staticFileCb, true);
                  return false;
                } else {
                  return true;
                }
              })
              .then((shouldAddToList) => {
                if (shouldAddToList) {
                  return archive.isUrlInList(urlToAdd);
                } else {
                  return null;
                }
              })
              .then((isInList) => {
                if (isInList) {
                  httpHelpers.serveAssets(res, '/loading.html', staticFileCb);
                  return false;
                } else if (isInList === false) {
                  httpHelpers.serveAssets(res, '/', staticFileCb);
                  return archive.addUrlToList(urlToAdd);
                } else {
                  return false;
                }
              })
              .then((hasBeenAddedToList) => {
                if (hasBeenAddedToList) {
                  res.statusCode = 302;
                  res.end();
                }
              })
              .catch((err) => {
                console.error('Error in promise chain', err);
              });
    });
  } else {
    res.end(archive.paths.list);
  }
};
