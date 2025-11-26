import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as types from '../actionTypes';
import * as filesApi from '../../services/api';

jest.mock('../../services/api');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Redux Actions', () => {
  describe('fetchFilesList', () => {
    it('should dispatch REQUEST and SUCCESS actions on success', async () => {
      const mockFiles = ['file1.csv', 'file2.csv'];
      filesApi.filesApi.getFilesList.mockResolvedValue({
        files: mockFiles,
      });

      const store = mockStore({});
      await store.dispatch(actions.fetchFilesList());

      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toHaveLength(2);
      expect(dispatchedActions[0].type).toBe(types.FETCH_FILES_LIST_REQUEST);
      expect(dispatchedActions[1].type).toBe(types.FETCH_FILES_LIST_SUCCESS);
    });

    it('should dispatch REQUEST and FAILURE actions on error', async () => {
      const errorMessage = 'Network error';
      filesApi.filesApi.getFilesList.mockRejectedValue(
        new Error(errorMessage)
      );

      const store = mockStore({});
      await store.dispatch(actions.fetchFilesList());

      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toHaveLength(2);
      expect(dispatchedActions[0].type).toBe(types.FETCH_FILES_LIST_REQUEST);
      expect(dispatchedActions[1].type).toBe(types.FETCH_FILES_LIST_FAILURE);
    });
  });

  describe('fetchFilesData', () => {
    it('should dispatch REQUEST and SUCCESS actions on success', async () => {
      const mockData = [
        {
          file: 'file1.csv',
          lines: [
            { text: 'test', number: 123, hex: 'abc123def456abc123def456abc123de' },
          ],
        },
      ];

      filesApi.filesApi.getFilesData.mockResolvedValue({
        data: mockData,
      });

      const expectedActions = [
        { type: types.FETCH_FILES_DATA_REQUEST },
        {
          type: types.FETCH_FILES_DATA_SUCCESS,
          payload: { data: mockData }, // API returns { data: [...] }
        },
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchFilesData());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should pass fileName parameter to API', async () => {
      const fileName = 'test.csv';
      const mockData = [];

      filesApi.filesApi.getFilesData.mockResolvedValue({
        data: mockData,
      });

      const store = mockStore({});
      await store.dispatch(actions.fetchFilesData(fileName));

      expect(filesApi.filesApi.getFilesData).toHaveBeenCalledWith(fileName);
    });

    it('should dispatch REQUEST and FAILURE actions on error', async () => {
      const errorMessage = 'Failed to fetch data';
      filesApi.filesApi.getFilesData.mockRejectedValue(
        new Error(errorMessage)
      );

      const expectedActions = [
        { type: types.FETCH_FILES_DATA_REQUEST },
        {
          type: types.FETCH_FILES_DATA_FAILURE,
          payload: errorMessage,
        },
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchFilesData());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should handle null fileName parameter', async () => {
      const mockData = [];
      filesApi.filesApi.getFilesData.mockResolvedValue({
        data: mockData,
      });

      const store = mockStore({});
      await store.dispatch(actions.fetchFilesData(null));

      expect(filesApi.filesApi.getFilesData).toHaveBeenCalledWith(null);
    });
  });

  describe('setSelectedFile', () => {
    it('should create an action with fileName', () => {
      const fileName = 'test.csv';
      const expectedAction = {
        type: types.SET_SELECTED_FILE,
        payload: fileName,
      };

      expect(actions.setSelectedFile(fileName)).toEqual(expectedAction);
    });

    it('should handle null fileName', () => {
      const expectedAction = {
        type: types.SET_SELECTED_FILE,
        payload: null,
      };

      expect(actions.setSelectedFile(null)).toEqual(expectedAction);
    });
  });

  describe('Action creators (basic)', () => {
    it('fetchFilesListRequest should create correct action', () => {
      const expectedAction = {
        type: types.FETCH_FILES_LIST_REQUEST,
      };
      expect(actions.fetchFilesListRequest()).toEqual(expectedAction);
    });

    it('fetchFilesListSuccess should create correct action', () => {
      const files = ['file.csv'];
      const expectedAction = {
        type: types.FETCH_FILES_LIST_SUCCESS,
        payload: files,
      };
      expect(actions.fetchFilesListSuccess(files)).toEqual(expectedAction);
    });

    it('fetchFilesListFailure should create correct action', () => {
      const error = 'Error message';
      const expectedAction = {
        type: types.FETCH_FILES_LIST_FAILURE,
        payload: error,
      };
      expect(actions.fetchFilesListFailure(error)).toEqual(expectedAction);
    });

    it('fetchFilesDataRequest should create correct action', () => {
      const expectedAction = {
        type: types.FETCH_FILES_DATA_REQUEST,
      };
      expect(actions.fetchFilesDataRequest()).toEqual(expectedAction);
    });

    it('fetchFilesDataSuccess should create correct action', () => {
      const data = [];
      const expectedAction = {
        type: types.FETCH_FILES_DATA_SUCCESS,
        payload: data,
      };
      expect(actions.fetchFilesDataSuccess(data)).toEqual(expectedAction);
    });

    it('fetchFilesDataFailure should create correct action', () => {
      const error = 'Error message';
      const expectedAction = {
        type: types.FETCH_FILES_DATA_FAILURE,
        payload: error,
      };
      expect(actions.fetchFilesDataFailure(error)).toEqual(expectedAction);
    });
  });
});
