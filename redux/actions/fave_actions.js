import * as StorageUtil from '../util/storage_util';

export const RECEIVE_FAVES = "RECEIVE_FAVES";
export const RECEIVE_FAVE = "RECEIVE_FAVE";
export const REMOVE_FAVE = "REMOVE_FAVE";

const receiveFaves = (faves) => ({
  type: RECEIVE_FAVES,
  faves
});

const receiveFave = (fave) => ({
  type: RECEIVE_FAVE,
  fave
});

const removeFave = (faveId) => ({
  type: REMOVE_FAVE,
  faveId
});

export const getAllFaves = () => dispatch => {
  return StorageUtil.retrieveAllData().then(faves => {
    dispatch(receiveFaves(faves))
  })
}

export const addFave = (fave) => dispatch => {
  return StorageUtil.storeOne(fave).then(newFave => {
    dispatch(receiveFave(newFave))
  })
}

export const deleteFave = (faveKey) => dispatch => {
  return StorageUtil.deleteOne(faveKey).then(() => {
    dispatch(removeFave(faveKey))
  })
}