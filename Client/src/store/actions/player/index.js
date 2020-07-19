import {
  SET_IS_PLAYING,
  SET_MASTER_MODE,
  SET_REPEAT_MODE,
  SET_RANDOM_MODE,
  SET_CURRENT_PLAY_TIME,
} from '../../action-types';

export function setIsPlaying(isPlaying) {
  return function(dispatch) {
    dispatch({ type: SET_IS_PLAYING, payload: isPlaying });
  };
}

export function setMasterMode(isMasterModeEnabled) {
  return function(dispatch) {
    dispatch({ type: SET_MASTER_MODE, payload: isMasterModeEnabled });
  };
}

export function setRepeatMode(isRepeatMode) {
  return function(dispatch) {
    dispatch({ type: SET_REPEAT_MODE, payload: isRepeatMode });
  };
}

export function setRandomMode(isRandomMode) {
  return function(dispatch) {
    dispatch({ type: SET_RANDOM_MODE, payload: isRandomMode });
  };
}

export function setCurrentPlayTime(currentPlayTime) {
  return function(dispatch) {
    dispatch({ type: SET_CURRENT_PLAY_TIME, payload: currentPlayTime });
  };
}
