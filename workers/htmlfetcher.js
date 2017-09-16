const archive = require('../helpers/archive-helpers');

const fetcher = () => {
  archive.readListOfUrls((urls)=>{
    archive.downloadUrls(urls);
  });
};

fetcher();
