const archive = require('../helpers/archive-helpers');

const fetcher = () => {
  archive.readListOfUrls()
          .then((urls) => {
            return archive.downloadUrls(urls);
          })
          .catch((err) => {
            console.error('error in fetcher', err);
          });
};

fetcher();
