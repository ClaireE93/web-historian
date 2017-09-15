var archive = require('../helpers/archive-helpers');
// const fs = require('fs');
const path = require('path');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const fs = require('fs');
  const { url, method, headers } = req;
  let statusCode;

  if (url === '/' && method === 'GET') {
    statusCode = 200;
    const urlPath = path.join(__dirname, '/public/index.html');
    console.log('path is', urlPath);
    fs.readFile(urlPath, (err, data) => {
      if (err) { throw err; }
      res.end(data.toString());
    });
  } else {
    res.end(archive.paths.list);
  }


};
