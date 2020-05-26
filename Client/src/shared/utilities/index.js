export const secondsToMinutesFormat = (seconds) => Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);

export const getNextTrackForPlaylist = (songGroups, activeTrackId, isMasterFilterEnabled) => {
  const {
    activeSongGroup,
    activeSongGroupPosition,
    activeTrackPosition,
  } = getActiveSongGroupAndTrack(songGroups, activeTrackId);

  if (isMasterFilterEnabled) {
    return songGroups.length - 1 === activeSongGroupPosition
      ? songGroups[0].songs.find(s => s.isMaster)
      : songGroups[activeSongGroupPosition + 1].songs.find(s => s.isMaster);
  }

  if (activeSongGroup.songs.length - 1 === activeTrackPosition) {
    return songGroups.length - 1 === activeSongGroupPosition
      ? songGroups[0].songs[0]
      : songGroups[activeSongGroupPosition + 1].songs[0];
  }

  return activeSongGroup.songs[activeTrackPosition + 1];
};

export const getPreviousTrackForPlaylist = (songGroups, activeTrackId, isMasterFilterEnabled) => {
  const {
    activeSongGroup,
    activeSongGroupPosition,
    activeTrackPosition,
  } = getActiveSongGroupAndTrack(songGroups, activeTrackId);

  if (isMasterFilterEnabled) {
    return activeSongGroupPosition === 0
      ? songGroups[songGroups.length - 1].songs.find(s => s.isMaster)
      : songGroups[activeSongGroupPosition - 1].songs.find(s => s.isMaster);
  }

  if (activeTrackPosition === 0) {
    return activeSongGroupPosition === 0
      ? songGroups[songGroups.length - 1].songs[songGroups[songGroups.length - 1].songs.length - 1]
      : songGroups[activeSongGroupPosition - 1].songs[songGroups[activeSongGroupPosition - 1].songs.length - 1];
  }

  return activeSongGroup.songs[activeTrackPosition - 1];
};

export const getBlobBaseUrl = () => {
  return "https://truemuz.blob.core.windows.net/songs";
};

export const getActiveSongGroupAndTrack = (songGroups, activeTrackId) => {
  const activeSongGroup = songGroups.find(sg => sg.songs.find(s => s.id === activeTrackId));
  const activeSongGroupPosition = songGroups.indexOf(activeSongGroup);
  const activeTrackPosition = activeSongGroup.songs.findIndex(s => s.id === activeTrackId);

  return {
    activeSongGroup,
    activeSongGroupPosition,
    activeTrackPosition,
  };
};