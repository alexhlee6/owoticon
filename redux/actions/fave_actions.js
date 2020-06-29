import * as StorageUtil from '../util/storage_util';

export const RECEIVE_FAVES = "RECEIVE_FAVES";


const receiveFaves = (faves) => ({
  type: RECEIVE_FAVES,
  faves
});


export const getAllFaves = () => dispatch => {
  return StorageUtil.retrieveAllData().then(faves => {
    dispatch(receiveFaves(faves))
  })
}

export const addFave = (key, val) => dispatch => {
  return StorageUtil.storeOne(key, val).then(faves => {
    dispatch(receiveFaves(faves))
  })
}

export const deleteFave = (faveKey) => dispatch => {
  return StorageUtil.deleteOne(faveKey).then(faves => {
    dispatch(receiveFaves(faves))
  })
}

export const updateFaveOrder = (favesPos) => dispatch => {
  return StorageUtil.updateFaveOrder(favesPos).then(faves => {
    dispatch(receiveFaves(faves))
  })
}