import {
  LOAD_BAND_INFO_STARTED,
  LOAD_BAND_INFO_COMPLETED,
  LOAD_BAND_INFO_FAILED,
  SET_ACTIVE_TRACK,
  SET_ACTIVE_WIKI_TRACK,
  SET_COLLAPSED_SONG_GROUP,
} from "../../action-types";
import { getBandInfoByName } from '../../../services/api-service';

export function loadBandInfo() {
  return async function(dispatch) {
    dispatch({ type: LOAD_BAND_INFO_STARTED });

    try {
      const data = await getBandInfoByName('Modernova');
      const album = data.albums[0];
      delete data.albums;
      data.album = album;
      
      dispatch({ type: LOAD_BAND_INFO_COMPLETED, payload: data });
    } catch (error) {
      dispatch({ type: LOAD_BAND_INFO_FAILED, payload: error.message });
    }
  };
}

export function setActiveTrack(activeTrack) {
  return function(dispatch) {
    dispatch({ type: SET_ACTIVE_TRACK, payload: activeTrack });
  };
}

export function setActiveWikiTrack(activeWikiTrack) {
  return function(dispatch) {
    dispatch({ type: SET_ACTIVE_WIKI_TRACK, payload: activeWikiTrack });
  };
}

export function setCollapsedSongGroup(songGroupIndex, value) {
  return function(dispatch, getState) {
    const { selectedBand } = getState();
    const updatedCollapsedSongGroups = [...selectedBand.collapsedSongGroups];
    
    updatedCollapsedSongGroups[songGroupIndex] = value;

    dispatch({ type: SET_COLLAPSED_SONG_GROUP, payload: updatedCollapsedSongGroups });
  };
}
