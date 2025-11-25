const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const axios = require('axios');
const externalApiService = require('../../../src/services/externalApi.service');
const config = require('../../../src/config');
const { CSV_CONFIG, ERROR_MESSAGES } = require('../../../src/constants');

describe('External API Service', () => {
  const baseUrl = config.externalApi.baseUrl;
  const authHeader = config.externalApi.apiKey;

  afterEach(() => {
    nock.cleanAll();
    sinon.restore();
  });

  describe('getFilesList', () => {
    it('should return files list on success', async () => {
      const mockFiles = ['file1.csv', 'file2.csv', 'file3.csv'];
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: mockFiles });

      const result = await externalApiService.getFilesList();

      expect(result).to.deep.equal(mockFiles);
    });

    it('should return empty array when API returns empty files', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: [] });

      const result = await externalApiService.getFilesList();

      expect(result).to.deep.equal([]);
    });

    it('should return empty array when API returns no files property', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, {});

      const result = await externalApiService.getFilesList();

      expect(result).to.deep.equal([]);
    });

    it('should throw error on network failure', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .replyWithError('Network error');

      try {
        await externalApiService.getFilesList();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(ERROR_MESSAGES.FETCH_FILES_LIST_FAILED);
      }
    });

    it('should throw error on 500 status', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(500, { error: 'Internal Server Error' });

      try {
        await externalApiService.getFilesList();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(ERROR_MESSAGES.FETCH_FILES_LIST_FAILED);
      }
    });

    it('should throw error on 401 unauthorized', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(401, { error: 'Unauthorized' });

      try {
        await externalApiService.getFilesList();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal(ERROR_MESSAGES.FETCH_FILES_LIST_FAILED);
      }
    });
  });

  describe('getFileContent', () => {
    it('should return file content on success', async () => {
      const mockContent = 'file,text,number,hex\ndata1,test1,123,abc123def456abc123def456abc123de';
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/test.csv')
        .reply(200, mockContent);

      const result = await externalApiService.getFileContent('test.csv');

      expect(result).to.equal(mockContent);
    });

    it('should return null on 404 error', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/missing.csv')
        .reply(404, { error: 'Not Found' });

      const result = await externalApiService.getFileContent('missing.csv');

      expect(result).to.be.null;
    });

    it('should return null on 500 error', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/error.csv')
        .reply(500, { error: 'Internal Server Error' });

      const result = await externalApiService.getFileContent('error.csv');

      expect(result).to.be.null;
    });

    it('should return null on network error', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/network.csv')
        .replyWithError('Network error');

      const result = await externalApiService.getFileContent('network.csv');

      expect(result).to.be.null;
    });

    it('should log error for non-404/500 errors', async () => {
      const consoleErrorStub = sinon.stub(console, 'error');
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/forbidden.csv')
        .reply(403, { error: 'Forbidden' });

      await externalApiService.getFileContent('forbidden.csv');

      expect(consoleErrorStub.called).to.be.true;
      consoleErrorStub.restore();
    });
  });

  describe('parseCSV', () => {
    it('should parse valid CSV content', () => {
      const csvContent = 'file,text,number,hex\ndata1,hello,123,abc123def456abc123def456abc123de\ndata2,world,456,def456abc123def456abc123def456ab';

      const result = externalApiService.parseCSV(csvContent);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.deep.equal({
        file: 'data1',
        text: 'hello',
        number: '123',
        hex: 'abc123def456abc123def456abc123de',
      });
    });

    it('should skip empty lines', () => {
      const csvContent = 'file,text,number,hex\ndata1,hello,123,abc123def456abc123def456abc123de\n\ndata2,world,456,def456abc123def456abc123def456ab';

      const result = externalApiService.parseCSV(csvContent);

      expect(result).to.have.lengthOf(2);
    });

    it('should trim whitespace', () => {
      const csvContent = 'file,text,number,hex\n  data1  ,  hello  ,  123  ,  abc123def456abc123def456abc123de  ';

      const result = externalApiService.parseCSV(csvContent);

      expect(result[0].file).to.equal('data1');
      expect(result[0].text).to.equal('hello');
      expect(result[0].number).to.equal('123');
    });

    it('should return empty array on parse error', () => {
      const invalidCsvContent = 'not valid csv\x00\x01\x02';

      const result = externalApiService.parseCSV(invalidCsvContent);

      expect(result).to.be.an('array');
    });

    it('should handle CSV with extra columns', () => {
      const csvContent = 'file,text,number,hex,extra\ndata1,hello,123,abc123def456abc123def456abc123de,extra_value';

      const result = externalApiService.parseCSV(csvContent);

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('extra', 'extra_value');
    });
  });

  describe('validateCSVLine', () => {
    it('should validate correct CSV line', () => {
      const validLine = {
        file: 'test.csv',
        text: 'hello',
        number: '123',
        hex: 'abc123def456abc123def456abc123de',
      };

      const result = externalApiService.validateCSVLine(validLine);

      expect(result).to.be.true;
    });

    it('should reject line missing required field', () => {
      const invalidLine = {
        file: 'test.csv',
        text: 'hello',
        number: '123',
        // missing hex
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with empty field', () => {
      const invalidLine = {
        file: 'test.csv',
        text: '',
        number: '123',
        hex: 'abc123def456abc123def456abc123de',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with null field', () => {
      const invalidLine = {
        file: 'test.csv',
        text: null,
        number: '123',
        hex: 'abc123def456abc123def456abc123de',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with undefined field', () => {
      const invalidLine = {
        file: 'test.csv',
        text: undefined,
        number: '123',
        hex: 'abc123def456abc123def456abc123de',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with invalid number', () => {
      const invalidLine = {
        file: 'test.csv',
        text: 'hello',
        number: 'not_a_number',
        hex: 'abc123def456abc123def456abc123de',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with empty number', () => {
      const invalidLine = {
        file: 'test.csv',
        text: 'hello',
        number: '   ',
        hex: 'abc123def456abc123def456abc123de',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with invalid hex (wrong length)', () => {
      const invalidLine = {
        file: 'test.csv',
        text: 'hello',
        number: '123',
        hex: 'abc123',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should reject line with invalid hex (non-hex characters)', () => {
      const invalidLine = {
        file: 'test.csv',
        text: 'hello',
        number: '123',
        hex: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
      };

      const result = externalApiService.validateCSVLine(invalidLine);

      expect(result).to.be.false;
    });

    it('should accept hex with uppercase', () => {
      const validLine = {
        file: 'test.csv',
        text: 'hello',
        number: '123',
        hex: 'ABC123DEF456ABC123DEF456ABC123DE',
      };

      const result = externalApiService.validateCSVLine(validLine);

      expect(result).to.be.true;
    });

    it('should accept hex with mixed case', () => {
      const validLine = {
        file: 'test.csv',
        text: 'hello',
        number: '123',
        hex: 'AbC123DeF456aBc123DeF456AbC123De',
      };

      const result = externalApiService.validateCSVLine(validLine);

      expect(result).to.be.true;
    });
  });

  describe('processFiles', () => {
    it('should process files successfully', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,test1,123,abc123def456abc123def456abc123de');

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(200, 'file,text,number,hex\nfile2.csv,test2,456,def456abc123def456abc123def456ab');

      const result = await externalApiService.processFiles();

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.have.property('file', 'file1.csv');
      expect(result[0]).to.have.property('lines');
      expect(result[0].lines[0]).to.have.property('number', 123);
    });

    it('should filter by fileName when provided', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,test1,123,abc123def456abc123def456abc123de');

      const result = await externalApiService.processFiles('file1.csv');

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('file', 'file1.csv');
    });

    it('should skip files with no valid lines', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,test1,invalid_number,abc123def456abc123def456abc123de');

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(200, 'file,text,number,hex\nfile2.csv,test2,456,def456abc123def456abc123def456ab');

      const result = await externalApiService.processFiles();

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('file', 'file2.csv');
    });

    it('should handle file fetch errors gracefully', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .replyWithError('Network error');

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(200, 'file,text,number,hex\nfile2.csv,test2,456,def456abc123def456abc123def456ab');

      const result = await externalApiService.processFiles();

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('file', 'file2.csv');
    });

    it('should skip files that return null content', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(404);

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(200, 'file,text,number,hex\nfile2.csv,test2,456,def456abc123def456abc123def456ab');

      const result = await externalApiService.processFiles();

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('file', 'file2.csv');
    });

    it('should return empty array when no files available', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: [] });

      const result = await externalApiService.processFiles();

      expect(result).to.deep.equal([]);
    });

    it('should convert number string to integer', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,test1,999,abc123def456abc123def456abc123de');

      const result = await externalApiService.processFiles();

      expect(result[0].lines[0].number).to.equal(999);
      expect(typeof result[0].lines[0].number).to.equal('number');
    });

    it('should handle multiple valid lines in one file', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, `file,text,number,hex
file1.csv,test1,123,abc123def456abc123def456abc123de
file1.csv,test2,456,def456abc123def456abc123def456ab
file1.csv,test3,789,abc789def012abc789def012abc789de`);

      const result = await externalApiService.processFiles();

      expect(result).to.have.lengthOf(1);
      expect(result[0].lines).to.have.lengthOf(3);
    });

    it('should return data with correct structure', async () => {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] });

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex\nfile1.csv,hello,123,abc123def456abc123def456abc123de');

      const result = await externalApiService.processFiles();

      expect(result[0]).to.have.keys('file', 'lines');
      expect(result[0].lines[0]).to.have.keys('text', 'number', 'hex');
    });
  });
});
