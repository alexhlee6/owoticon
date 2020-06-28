import { RECEIVE_FAVES } from '../actions/fave_actions';

const favesReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_FAVES:
      console.log("RECEIVE_FAVES:", action.faves);
      return action.faves;

    
    
    default:
      return state;
  }
}

export default favesReducer;