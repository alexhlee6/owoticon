// import { RECEIVE_FAVES } from '../actions/fave_actions';

const favesReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {

    // case RECEIVE_FAVES:
    // return action.faves;
    default:
      return state;
  }
}

export default favesReducer;