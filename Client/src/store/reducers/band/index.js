import {
  LOAD_BAND_INFO_STARTED,
  LOAD_BAND_INFO_COMPLETED,
  LOAD_BAND_INFO_FAILED,
  SET_ACTIVE_TRACK,
  SET_ACTIVE_WIKI_TRACK,
  SET_COLLAPSED_SONG_GROUP,
} from '../../action-types';

const initialState = {
  isLoading: false,
  errorMessage: null,
  bandInfo: null,
  activeTrack: null,
  collapsedSongGroups: [],
};

export default function bandReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BAND_INFO_STARTED:
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
      };
    case LOAD_BAND_INFO_COMPLETED:
      return {
        ...state,
        isLoading: false,
        bandInfo: action.payload,
        collapsedSongGroups: action.payload.album.songGroups.map(() => false),
      };
    case LOAD_BAND_INFO_FAILED:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      };
    case SET_ACTIVE_TRACK:
      return {
        ...state,
        activeTrack: action.payload,
      };
    case SET_ACTIVE_WIKI_TRACK:
      return {
        ...state,
        activeWikiTrack: action.payload,
      };
    case SET_COLLAPSED_SONG_GROUP:
      return {
        ...state,
        collapsedSongGroups: action.payload,
      };
  }

  return state;
}
