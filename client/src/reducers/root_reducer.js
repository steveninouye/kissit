import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// import session from './session_reducer';
// import entities from './entities_reducer';
// import errors from './errors_reducer';
// import ui from './ui_reducer';

const rootReducer = combineReducers({
  // entities,
  // session,
  // errors,
  // ui
});

const configureStore = (preloadedState = {}) =>
  process.env.NODE_ENV === 'production'
    ? createStore(rootReducer, preloadedState, applyMiddleware(thunk))
    : createStore(rootReducer, preloadedState, applyMiddleware(thunk, logger));

export default configureStore;
