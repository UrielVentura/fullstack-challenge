const { expect } = require('chai');
const sinon = require('sinon');
const filesController = require('../../../src/controllers/files.controller');
const externalApiService = require('../../../src/services/externalApi.service');

describe('Files Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getFilesList', () => {
    it('should return list of files with 200 status', async () => {
      const mockFiles = ['file1.csv', 'file2.csv'];
      const req = {};
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };

      sandbox.stub(externalApiService, 'getFilesList').resolves(mockFiles);

      await filesController.getFilesList(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ files: mockFiles })).to.be.true;
    });

    it('should return empty array when no files', async () => {
      const req = {};
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };

      sandbox.stub(externalApiService, 'getFilesList').resolves([]);

      await filesController.getFilesList(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ files: [] })).to.be.true;
    });

    it('should call status and json on success', async () => {
      const mockFiles = ['test.csv'];
      const req = {};
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };

      sandbox.stub(externalApiService, 'getFilesList').resolves(mockFiles);

      await filesController.getFilesList(req, res);

      expect(res.status.called).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  describe('getFilesData', () => {
    it('should return processed files data with 200 status', async () => {
      const mockData = [
        {
          file: 'file1.csv',
          lines: [
            { text: 'test1', number: 123, hex: 'abc123def456abc123def456abc123de' },
          ],
        },
      ];
      const req = { query: {} };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };

      sandbox.stub(externalApiService, 'processFiles').resolves(mockData);

      await filesController.getFilesData(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockData)).to.be.true;
    });

    it('should pass fileName query parameter to service', async () => {
      const mockData = [
        {
          file: 'file1.csv',
          lines: [
            { text: 'test1', number: 123, hex: 'abc123def456abc123def456abc123de' },
          ],
        },
      ];
      const req = { query: { fileName: 'file1.csv' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };
      const processFilesStub = sandbox
        .stub(externalApiService, 'processFiles')
        .resolves(mockData);

      await filesController.getFilesData(req, res);

      expect(processFilesStub.calledWith('file1.csv')).to.be.true;
    });

    it('should pass undefined to service when no fileName query param', async () => {
      const req = { query: {} };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };
      const processFilesStub = sandbox
        .stub(externalApiService, 'processFiles')
        .resolves([]);

      await filesController.getFilesData(req, res);

      expect(processFilesStub.calledWith(undefined)).to.be.true;
    });

    it('should return empty array when no data', async () => {
      const req = { query: {} };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };

      sandbox.stub(externalApiService, 'processFiles').resolves([]);

      await filesController.getFilesData(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith([])).to.be.true;
    });

    it('should extract fileName from multiple query params correctly', async () => {
      const req = { query: { fileName: 'test.csv', other: 'param' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };
      const processFilesStub = sandbox
        .stub(externalApiService, 'processFiles')
        .resolves([]);

      await filesController.getFilesData(req, res);

      expect(processFilesStub.calledWith('test.csv')).to.be.true;
    });

    it('should handle query param case sensitivity', async () => {
      const req = { query: { fileName: 'FILE1.csv' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis(),
      };
      const processFilesStub = sandbox
        .stub(externalApiService, 'processFiles')
        .resolves([]);

      await filesController.getFilesData(req, res);

      expect(processFilesStub.calledWith('FILE1.csv')).to.be.true;
    });
  });
});
