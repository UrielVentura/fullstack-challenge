const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const nock = require('nock');
const chai = require('chai');
const app = require('../../../src/app');

chai.use(chaiHttp);

describe('Files Routes Integration Tests', () => {
  afterEach(() => {
    nock.cleanAll();
    sinon.restore();
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const res = await chai.request(app).get('/health');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ status: 'ok' });
    });

    it('should be accessible without errors', async () => {
      const res = await chai.request(app).get('/health');

      expect(res).to.be.ok;
      expect(res.body).to.have.property('status');
    });
  });

  describe('GET /files/list', () => {
    it('should return list of files', async () => {
      const mockFiles = ['file1.csv', 'file2.csv', 'file3.csv'];
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: mockFiles });

      const res = await chai.request(app).get('/files/list');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('files');
      expect(res.body.files).to.deep.equal(mockFiles);
    });

    it('should return empty array when no files', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: [] });

      const res = await chai.request(app).get('/files/list');

      expect(res).to.have.status(200);
      expect(res.body.files).to.deep.equal([]);
    });

    it('should return 500 on external API error', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .replyWithError('Network error');

      const res = await chai.request(app).get('/files/list');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });

    it('should return proper error message on API failure', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(500, { error: 'Internal Server Error' });

      const res = await chai.request(app).get('/files/list');

      expect(res).to.have.status(500);
    });
  });

  describe('GET /files/data', () => {
    it('should return processed files data', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(
          200,
          'file,text,number,hex\nfile1.csv,test1,123,abc123def456abc123def456abc123de'
        );

      const res = await chai.request(app).get('/files/data');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('file', 'file1.csv');
      expect(res.body[0]).to.have.property('lines');
    });

    it('should return formatted data with converted number types', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(
          200,
          'file,text,number,hex\nfile1.csv,hello,999,abc123def456abc123def456abc123de'
        );

      const res = await chai.request(app).get('/files/data');

      expect(res.body[0].lines[0]).to.have.property('number', 999);
      expect(typeof res.body[0].lines[0].number).to.equal('number');
    });

    it('should filter files by fileName query parameter', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(
          200,
          'file,text,number,hex\nfile1.csv,test1,123,abc123def456abc123def456abc123de'
        );

      const res = await chai
        .request(app)
        .get('/files/data')
        .query({ fileName: 'file1.csv' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('file', 'file1.csv');
    });

    it('should return empty array when no files match filter', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      const res = await chai
        .request(app)
        .get('/files/data')
        .query({ fileName: 'nonexistent.csv' });

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal([]);
    });

    it('should skip files with invalid CSV data', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,test1,invalid,not_hex');

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(
          200,
          'file,text,number,hex\nfile2.csv,test2,456,def456abc123def456abc123def456ab'
        );

      const res = await chai.request(app).get('/files/data');

      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('file', 'file2.csv');
    });

    it('should handle missing files gracefully', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(404);

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(
          200,
          'file,text,number,hex\nfile2.csv,test2,456,def456abc123def456abc123def456ab'
        );

      const res = await chai.request(app).get('/files/data');

      expect(res).to.have.status(200);
      expect(res.body).to.have.lengthOf(1);
    });

    it('should return empty array when no data available', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: [] });

      const res = await chai.request(app).get('/files/data');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal([]);
    });

    it('should return 500 on service error', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .replyWithError('Network error');

      const res = await chai.request(app).get('/files/data');

      expect(res).to.have.status(500);
    });

    it('should return only fields: text, number, hex in lines', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(
          200,
          'file,text,number,hex\nfile1.csv,test1,123,abc123def456abc123def456abc123de'
        );

      const res = await chai.request(app).get('/files/data');

      const line = res.body[0].lines[0];
      expect(line).to.have.keys('text', 'number', 'hex');
      expect(line).to.not.have.property('file');
    });

    it('should handle multiple valid lines in one file', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(
          200,
          `file,text,number,hex
file1.csv,test1,123,abc123def456abc123def456abc123de
file1.csv,test2,456,def456abc123def456abc123def456ab
file1.csv,test3,789,abc789def012abc789def012abc789de`
        );

      const res = await chai.request(app).get('/files/data');

      expect(res.body[0].lines).to.have.lengthOf(3);
      expect(res.body[0].lines[1]).to.have.property('text', 'test2');
      expect(res.body[0].lines[2]).to.have.property('number', 789);
    });

    it('should validate hex field strictly (32 char hex)', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(
          200,
          `file,text,number,hex
file1.csv,valid,123,abc123def456abc123def456abc123de
file1.csv,tooshort,456,abc123def456
file1.csv,nonhex,789,zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz`
        );

      const res = await chai.request(app).get('/files/data');

      expect(res.body[0].lines).to.have.lengthOf(1);
      expect(res.body[0].lines[0]).to.have.property('text', 'valid');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for undefined route', async () => {
      const res = await chai.request(app).get('/nonexistent');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'Not Found');
    });

    it('should return 404 for undefined files route', async () => {
      const res = await chai.request(app).get('/files/undefined');

      expect(res).to.have.status(404);
    });
  });
});
