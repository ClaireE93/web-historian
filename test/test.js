var expect = require('chai').expect;
var server = require('../web/basic-server.js');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var path = require('path');
var supertest = require('supertest');
var initialize = require('../web/initialize.js');

initialize(path.join(__dirname, '/testdata'));

archive.initialize({
  archivedSites: path.join(__dirname, '/testdata/sites'),
  list: path.join(__dirname, '/testdata/sites.txt')
});

var request = supertest.agent(server);

describe('server', function() {
  describe('GET /', function () {
    it('should return the content of index.html', function (done) {
      // just assume that if it contains an <input> tag its index.html
      request
        .get('/')
        .expect(200, /<input/, done);
    });
  });

  describe('archived websites', function () {
    describe('GET', function () {
      it('should return the content of a website from the archive', function (done) {
        var fixtureName = 'www.google.com';
        // var fixturePath = archive.paths.archivedSites + '/' + fixtureName;
        const fixturePath = path.join(__dirname, `../web/archives/sites/${fixtureName}`);
        // Create or clear the file.
        var fd = fs.openSync(fixturePath, 'w');
        fs.writeSync(fd, 'google');
        fs.closeSync(fd);

        // Write data to the file.
        fs.writeFileSync(fixturePath, 'google');

        request
          .get('/' + fixtureName)
          .expect(200, /google/, function (err) {
            fs.unlinkSync(fixturePath);
            done(err);
          });
      });

      it('Should 404 when asked for a nonexistent file', function(done) {
        request.get('/arglebargle').expect(404, done);
      });
    });

    describe('POST', function () {
      it('should append submitted sites to \'sites.txt\'', function(done) {
        var url = 'www.example.com';

        // Reset the test file and process request
        const testFile = path.join(__dirname, `../web/archives/sites.txt`);
        // fs.closeSync(fs.openSync(archive.paths.list, 'w'));
        fs.closeSync(fs.openSync(testFile, 'w'));

        request
          .post('/')
          .type('form')
          .send({ url: url })
          .expect(302, function (err) {
            if (!err) {
              // var fileContents = fs.readFileSync(archive.paths.list, 'utf8');
              var fileContents = fs.readFileSync(testFile, 'utf8');
              expect(fileContents.toString()).to.equal(url + '\n');
            }

            done(err);
          });
      });
    });
  });
});

describe('archive helpers', function() {
  describe('#readListOfUrls', function () {
    it('should read urls from sites.txt', function (done) {
      var urlArray = ['example1.com', 'example2.com'];
      const testPath = path.join(__dirname, `../web/archives/sites.txt`);
      // fs.writeFileSync(archive.paths.list, urlArray.join('\n'));
      fs.writeFileSync(testPath, urlArray.join('\n'));

      // archive.readListOfUrls(function(urls) {
      //   expect(urls).to.deep.equal(urlArray);
      //   done();
      // });

      archive.readListOfUrls()
      .then((urls) => {
        console.log('urls are', urls);
        expect(urls).to.deep.equal(urlArray);
        done();
      });
    });
  });

  describe('#isUrlInList', function () {
    it('should check if a url is in the list', function (done) {
      var urlArray = ['example1.com', 'example2.com'];
      const testPath = path.join(__dirname, `../web/archives/sites.txt`);
      // fs.writeFileSync(archive.paths.list, urlArray.join('\n'));
      fs.writeFileSync(testPath, urlArray.join('\n'));

      var counter = 0;
      var total = 2;

      archive.isUrlInList('example1.com', function (exists) {
        expect(exists).to.be.true;
        if (++counter === total) { done(); }
      });

      archive.isUrlInList('gibberish', function (exists) {
        expect(exists).to.be.false;
        if (++counter === total) { done(); }
      });
    });
  });

  describe('#addUrlToList', function () {
    it('should add a url to the list', function (done) {
      var urlArray = ['example1.com', 'example2.com\n'];
      const testPath = path.join(__dirname, `../web/archives/sites.txt`);
      // fs.writeFileSync(archive.paths.list, urlArray.join('\n'));
      fs.writeFileSync(testPath, urlArray.join('\n'));

      archive.addUrlToList('someurl.com', function () {
        archive.isUrlInList('someurl.com', function (exists) {
          expect(exists).to.be.true;
          done();
        });
      });
    });
  });

  describe('#isUrlArchived', function () {
    it('should check if a url is archived', function (done) {
      const testPath = path.join(__dirname, `../web/archives/sites`);
      // fs.writeFileSync(archive.paths.archivedSites + '/www.example.com', 'blah blah');
      fs.writeFileSync(testPath + '/www.example.com', 'blah blah');

      var counter = 0;
      var total = 2;

      archive.isUrlArchived('www.example.com', function (exists) {
        expect(exists).to.be.true;
        if (++counter === total) { done(); }
      });

      archive.isUrlArchived('www.notarchived.com', function (exists) {
        expect(exists).to.be.false;
        if (++counter === total) { done(); }
      });
    });
  });

  describe('#downloadUrls', function () {
    it('should download all pending urls in the list', function (done) {
      var urlArray = ['www.example.com', 'www.google.com'];
      archive.downloadUrls(urlArray);

      // Ugly hack to wait for all downloads to finish.
      setTimeout(function () {
        // expect(fs.readdirSync(archive.paths.archivedSites)).to.deep.equal(urlArray);
        expect(fs.readdirSync(path.join(__dirname, `../web/archives/sites`))).to.deep.equal(urlArray);
        done();
      }, 1500);
    });
  });

  describe('#addUrls', function () {
    it('should handle users adding http:// to input url', function (done) {
      archive.addUrlToList('http://www.example123.com')
      .then(() => {
        return archive.isUrlInList('www.example123.com');
      })
      .then((isInList) => {
        expect(isInList).to.equal(true);
        done();
      });
    });
  });

  describe('#addInvalidUrls', function () {
    it('should handle users adding invalid urls', function (done) {
      archive.addUrlToList('ww.dsahljkhfljkhasd;ljjksdf????!!!!')
      .then(() => {
        return archive.downloadUrls(['ww.dsahljkhfljkhasd;ljjksdf????!!!!']);
      });

      setTimeout(function () {
        const contains = fs.readdirSync(path.join(__dirname, '../web/archives/sites')).includes('ww.dsahljkhfljkhasd;ljjksdf????!!!!');
        expect(contains).to.equal(false);
        done();
      }, 1500);
    });
  });

});
