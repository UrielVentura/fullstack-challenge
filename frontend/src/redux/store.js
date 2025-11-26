import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import thunk from "redux-thunk";
import filesReducer from "./reducers";

// Redux DevTools Extension
const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  filesReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
