import { RECEIVE_FAVES, RECEIVE_FAVE, REMOVE_FAVE } from '../actions/fave_actions';

const favesReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_FAVES:
      console.log("RECEIVE_FAVES:", action.faves);
      return action.faves;

    case RECEIVE_FAVE:
      let newState = Object.assign({}, state);
      // RETURN TO THIS
      return newState;
    
    default:
      return state;
  }
}

export default favesReducer;