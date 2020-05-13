import React from 'react';
import PropTypes from 'prop-types';

import TrackGroup from './TrackGroup';

Playlist.propTypes = {
  activeTrack: PropTypes.object,
  bandInfo: PropTypes.object,
  isPlaying: PropTypes.bool,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
  playerControl: PropTypes.object
};

export default function Playlist(props) {
  const { bandInfo } = props;

  const getAlbumTrackCounts = () => {
    const { songGroups } = bandInfo.albums[0];
    let alternativeTracksCount = 0;

    songGroups.forEach(sg => {
      alternativeTracksCount += sg.songs.length - 1;
    });

    return `${songGroups.length} main tracks, ${alternativeTracksCount} alternative versions`;
  };
  
  return (
    <div className="col-5 px-0 mt-3 pt-2">
      <div className="playlist-description mb-3 pb-2">
        <h5 className="mb-3 pb-2">
          PLAYLIST
        </h5>
        <div className="d-flex">
          <div className="light-text pr-1">Band:</div>
          <div>{bandInfo.name}</div>
        </div>
        <div className="d-flex">
          <div className="light-text pr-1">Album:</div>
          <div>{bandInfo.albums[0].name} ({bandInfo.albums[0].year})</div>
        </div>
        <div className="small-text">
          {getAlbumTrackCounts()}
        </div>
      </div>

      <div className="playlist-tracks ml-n5">
        {bandInfo.albums[0].songGroups.map((trackGroup, index) =>
          <TrackGroup
            key={index}
            trackGroup={trackGroup}
            activeTrack={props.activeTrack}
            isPlaying={props.isPlaying}
            changeActiveTrack={props.changeActiveTrack}
            changeIsPlaying={props.changeIsPlaying}
            playerControl = {props.playerControl}
          />
        )}
      </div>
    </div>
  );
}
