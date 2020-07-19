import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from './reducers';
import { SET_CURRENT_PLAY_TIME } from './action-types';

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    predicate: (getState, action) => action.type !== SET_CURRENT_PLAY_TIME,
  });

  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares));

export default store;
