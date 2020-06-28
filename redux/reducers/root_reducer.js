import { combineReducers } from 'redux';
import favesReducer from './faves_reducer';

const rootReducer = combineReducers({
  faves: favesReducer
});

export default rootReducer;