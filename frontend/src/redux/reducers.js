import * as types from "./actionTypes";

const initialState = {
  filesList: [],
  filesData: [],
  selectedFile: null,
  loading: false,
  error: null,
};

const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_FILES_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_FILES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        filesList: action.payload,
        error: null,
      };

    case types.FETCH_FILES_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.FETCH_FILES_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_FILES_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        filesData: action.payload,
        error: null,
      };

    case types.FETCH_FILES_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.SET_SELECTED_FILE:
      return {
        ...state,
        selectedFile: action.payload,
      };

    default:
      return state;
  }
};

export default filesReducer;
