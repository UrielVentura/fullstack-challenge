import { filesApi } from "../services/api";
import * as types from "./actionTypes";

// Fetch files list
export const fetchFilesListRequest = () => ({
  type: types.FETCH_FILES_LIST_REQUEST,
});

export const fetchFilesListSuccess = (files) => ({
  type: types.FETCH_FILES_LIST_SUCCESS,
  payload: files,
});

export const fetchFilesListFailure = (error) => ({
  type: types.FETCH_FILES_LIST_FAILURE,
  payload: error,
});

export const fetchFilesList = () => {
  return async (dispatch) => {
    dispatch(fetchFilesListRequest());
    try {
      const data = await filesApi.getFilesList();
      dispatch(fetchFilesListSuccess(data.files));
    } catch (error) {
      dispatch(fetchFilesListFailure(error.message));
    }
  };
};

// Fetch files data
export const fetchFilesDataRequest = () => ({
  type: types.FETCH_FILES_DATA_REQUEST,
});

export const fetchFilesDataSuccess = (data) => ({
  type: types.FETCH_FILES_DATA_SUCCESS,
  payload: data,
});

export const fetchFilesDataFailure = (error) => ({
  type: types.FETCH_FILES_DATA_FAILURE,
  payload: error,
});

export const fetchFilesData = (fileName = null) => {
  return async (dispatch) => {
    dispatch(fetchFilesDataRequest());
    try {
      const data = await filesApi.getFilesData(fileName);
      dispatch(fetchFilesDataSuccess(data));
    } catch (error) {
      dispatch(fetchFilesDataFailure(error.message));
    }
  };
};

// Set selected file
export const setSelectedFile = (fileName) => ({
  type: types.SET_SELECTED_FILE,
  payload: fileName,
});
