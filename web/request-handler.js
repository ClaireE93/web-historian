var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const path = require('path');
const urlMod = require('url');
const httpHelpers = require('./http-helpers');
// require more modules/folders here!


const staticFileCb = (err, data) => {
  if (err) {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.end(data.toString());
  }
};

const addUrlCb = (err) => {
  if (err) {
    res.statusCode = 404;
    res.end();
  } else {
    console.log('SEDING 302');
    res.statusCode = 302;
    res.end();
  }
};

exports.handleRequest = function (req, res) {
  const { url, method, headers } = req;
  let statusCode;
  const parsedURL = urlMod.parse(url, true);

  if (method === 'GET') {

    httpHelpers.serveAssets(res, url, staticFileCb);

  } else if (method === 'POST') {

    // const handleUrlInListResponse = (isInList) => {
    //   console.log('isInList', isInList);
    //   if (isInList) {
    //     httpHelpers.serveAssets(res, '/loading.html', staticFileCb);
    //   } else {
    //     archive.addUrlToList(url, addUrlCb);
    //   }
    // }
    //
    // archive.isUrlInList(url, handleUrlInListResponse);

  } else {
    res.end(archive.paths.list);
  }
};
