import {
  LOAD_BAND_INFO_STARTED,
  LOAD_BAND_INFO_COMPLETED,
  LOAD_BAND_INFO_FAILED,
  SET_ACTIVE_TRACK,
  SET_ACTIVE_WIKI_TRACK,
  SET_COLLAPSED_SONG_GROUP,
  SET_TAG,
} from "../../action-types";
import { getBandInfoByName } from '../../../services/api-service';

export function loadBandInfo(bandName) {
  return async function(dispatch) {
    dispatch({ type: LOAD_BAND_INFO_STARTED });

    try {
      const data = await getBandInfoByName(bandName);
      const album = data.albums[0];
      delete data.albums;
      data.album = album;

      const result = data.album.songGroups.map(songGroup => {
        let mergedArray = [];
        
        for (let i = 0; i < songGroup.songs.length; i++) {
          mergedArray = mergedArray.concat(songGroup.songs[i].tags);
        }
  
        return mergedArray;
      });
  
      const duplicatedTags = [].concat(...result);
      const uniqueTags = [...new Set(duplicatedTags)].sort();
      
      dispatch({ type: LOAD_BAND_INFO_COMPLETED, payload: { bandInfo: data, tags: uniqueTags } });
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

export function setTag(tagName, value) {
  return function(dispatch, getState) {
    const { selectedBand } = getState();
    const updatedTags = selectedBand.tags.map((tag) => {
      if (tag.name !== tagName) {
        return tag;
      }
  
      return {
        ...tag,
        isActive: value,
      };
    });

    let filteredSongGroups = JSON.parse(JSON.stringify(selectedBand.bandInfo.album.songGroups));
    const appliedTags = updatedTags.filter(tag => tag.isActive);

    if (appliedTags.length) {
      filteredSongGroups = filteredSongGroups.filter(songGroup => {
        const filteredSongs = songGroup.songs.filter(song =>
          appliedTags.every(tag =>
            song.tags.find(t => t === tag.name)));

        songGroup.songs = filteredSongs;

        return filteredSongs.length;
      });
    }

    dispatch({ type: SET_TAG, payload: { tags: updatedTags, filteredSongGroups } });
  };
}
