import React from 'react';
import PropTypes from 'prop-types';

import TrackGroup from './TrackGroup';
import './index.scss';

Playlist.propTypes = {
  bandInfo: PropTypes.object,
  playerControl: PropTypes.object,
  collapsedSongGroups: PropTypes.array,
};

function Playlist(props) {
  const { bandInfo } = props;

  const getAlbumTrackCounts = () => {
    const { songGroups } = bandInfo.album;
    let alternativeTracksCount = 0;

    songGroups.forEach(sg => {
      alternativeTracksCount += sg.songs.length - 1;
    });

    return `${songGroups.length} main tracks, ${alternativeTracksCount} alternative versions`;
  };
  
  return (
    <div className="col-12 col-lg-5 px-0 mt-3 pt-2 order-1 order-lg-0">
      <div className="playlist-description mb-3 pb-2">
        <h5 className="mb-3 pb-2 d-none d-lg-block">
          PLAYLIST
        </h5>
        <div className="d-flex">
          <div className="light-text pr-1">Band:</div>
          <div>{bandInfo.name}</div>
        </div>
        <div className="d-flex">
          <div className="light-text pr-1">Album:</div>
          <div>{bandInfo.album.name} ({bandInfo.album.year})</div>
        </div>
        <div className="small-text">
          {getAlbumTrackCounts()}
        </div>
      </div>

      <div className="playlist-tracks ml-n5">
        {bandInfo.album.songGroups.map((trackGroup, index) =>
          <TrackGroup
            key={index}
            trackGroupIndex={index}
            trackGroup={trackGroup}
            playerControl={props.playerControl}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(Playlist);