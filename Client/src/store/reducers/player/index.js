import {
  SET_IS_PLAYING,
  SET_MASTER_MODE,
  SET_REPEAT_MODE,
  SET_RANDOM_MODE,
  SET_CURRENT_PLAY_TIME,
} from '../../action-types';

const initialState = {
  isPlaying: false,
  isMasterModeEnabled: false,
  isRepeatModeEnabled: false,
  isRandomModeEnabled: false,
  currentPlayTime: 0,
};

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
      };
    case SET_MASTER_MODE:
      return {
        ...state,
        isMasterModeEnabled: action.payload,
      };
    case SET_REPEAT_MODE:
      return {
        ...state,
        isRepeatModeEnabled: action.payload,
      };
    case SET_RANDOM_MODE:
      return {
        ...state,
        isRandomModeEnabled: action.payload,
      };
    case SET_CURRENT_PLAY_TIME:
      return {
        ...state,
        currentPlayTime: action.payload,
      };
  }

  return state;
}
