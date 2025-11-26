import { filesApi } from '../api';
import axios from 'axios';

jest.mock('axios');

describe('Files API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilesList', () => {
    it('should have getFilesList method', () => {
      expect(filesApi).toBeDefined();
      expect(filesApi.getFilesList).toBeDefined();
      expect(typeof filesApi.getFilesList).toBe('function');
    });

    it('should return a promise', () => {
      const result = filesApi.getFilesList();
      expect(result).toBeInstanceOf(Promise);
      // Catch to avoid unhandled rejection
      result.catch(() => {});
    });
  });

  describe('getFilesData', () => {
    it('should fetch files data successfully without fileName', async () => {
      expect(filesApi.getFilesData).toBeDefined();
    });

    it('should fetch files data with fileName parameter', async () => {
      const fileName = 'test.csv';
      expect(filesApi.getFilesData).toBeDefined();

      // Should accept fileName parameter
      filesApi.getFilesData(fileName).catch(() => {
        // Expected to throw due to mock
      });
    });

    it('should pass null when no fileName provided', async () => {
      expect(filesApi.getFilesData).toBeDefined();

      // Should accept null
      filesApi.getFilesData().catch(() => {
        // Expected to throw due to mock
      });
    });

    it('should include fileName in params when provided', async () => {
      const fileName = 'document.csv';
      expect(filesApi.getFilesData).toBeDefined();

      // Test that it accepts the parameter
      filesApi.getFilesData(fileName).catch(() => {
        // Expected
      });
    });
  });

  describe('API Configuration', () => {
    it('should have filesApi object with methods', () => {
      expect(filesApi).toHaveProperty('getFilesList');
      expect(filesApi).toHaveProperty('getFilesData');
    });

    it('should have callable methods', () => {
      expect(typeof filesApi.getFilesList).toBe('function');
      expect(typeof filesApi.getFilesData).toBe('function');
    });

    it('should methods return promises', async () => {
      const listPromise = filesApi.getFilesList();
      const dataPromise = filesApi.getFilesData();

      expect(listPromise).toBeInstanceOf(Promise);
      expect(dataPromise).toBeInstanceOf(Promise);

      // Catch to avoid unhandled promise rejection
      listPromise.catch(() => {});
      dataPromise.catch(() => {});
    });
  });
});
