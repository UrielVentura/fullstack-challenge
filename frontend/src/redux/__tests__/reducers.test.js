import filesReducer from '../reducers';
import * as types from '../actionTypes';

describe('Files Reducer', () => {
  const initialState = {
    filesList: [],
    filesData: [],
    selectedFile: null,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(filesReducer(undefined, {})).toEqual(initialState);
  });

  describe('FETCH_FILES_LIST_REQUEST', () => {
    it('should set loading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
      };

      const action = {
        type: types.FETCH_FILES_LIST_REQUEST,
      };

      const result = filesReducer(previousState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.filesList).toEqual([]);
    });
  });

  describe('FETCH_FILES_LIST_SUCCESS', () => {
    it('should set filesList and loading to false', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const mockFiles = ['file1.csv', 'file2.csv', 'file3.csv'];

      const action = {
        type: types.FETCH_FILES_LIST_SUCCESS,
        payload: mockFiles,
      };

      const result = filesReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.filesList).toEqual(mockFiles);
      expect(result.error).toBe(null);
    });

    it('should handle empty files list', () => {
      const action = {
        type: types.FETCH_FILES_LIST_SUCCESS,
        payload: [],
      };

      const result = filesReducer(initialState, action);

      expect(result.filesList).toEqual([]);
      expect(result.loading).toBe(false);
    });
  });

  describe('FETCH_FILES_LIST_FAILURE', () => {
    it('should set error and loading to false', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const errorMessage = 'Failed to fetch files';

      const action = {
        type: types.FETCH_FILES_LIST_FAILURE,
        payload: errorMessage,
      };

      const result = filesReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.filesList).toEqual([]);
    });
  });

  describe('FETCH_FILES_DATA_REQUEST', () => {
    it('should set loading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
      };

      const action = {
        type: types.FETCH_FILES_DATA_REQUEST,
      };

      const result = filesReducer(previousState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.filesData).toEqual([]);
    });
  });

  describe('FETCH_FILES_DATA_SUCCESS', () => {
    it('should set filesData and loading to false', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const mockData = [
        {
          file: 'file1.csv',
          lines: [
            { text: 'test1', number: 123, hex: 'abc123def456abc123def456abc123de' },
          ],
        },
      ];

      const action = {
        type: types.FETCH_FILES_DATA_SUCCESS,
        payload: mockData,
      };

      const result = filesReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.filesData).toEqual(mockData);
      expect(result.error).toBe(null);
    });

    it('should handle empty data', () => {
      const action = {
        type: types.FETCH_FILES_DATA_SUCCESS,
        payload: [],
      };

      const result = filesReducer(initialState, action);

      expect(result.filesData).toEqual([]);
      expect(result.loading).toBe(false);
    });
  });

  describe('FETCH_FILES_DATA_FAILURE', () => {
    it('should set error and loading to false', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const errorMessage = 'Failed to fetch data';

      const action = {
        type: types.FETCH_FILES_DATA_FAILURE,
        payload: errorMessage,
      };

      const result = filesReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.filesData).toEqual([]);
    });
  });

  describe('SET_SELECTED_FILE', () => {
    it('should set selectedFile', () => {
      const fileName = 'test.csv';

      const action = {
        type: types.SET_SELECTED_FILE,
        payload: fileName,
      };

      const result = filesReducer(initialState, action);

      expect(result.selectedFile).toBe(fileName);
      expect(result.filesList).toEqual([]);
    });

    it('should set selectedFile to null', () => {
      const previousState = {
        ...initialState,
        selectedFile: 'file.csv',
      };

      const action = {
        type: types.SET_SELECTED_FILE,
        payload: null,
      };

      const result = filesReducer(previousState, action);

      expect(result.selectedFile).toBe(null);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const previousState = {
        ...initialState,
        filesList: ['file.csv'],
        loading: true,
      };

      const action = {
        type: 'UNKNOWN_ACTION',
      };

      const result = filesReducer(previousState, action);

      expect(result).toEqual(previousState);
    });
  });
});
