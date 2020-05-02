import React from 'react';
import PropTypes from 'prop-types';

import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';

BandInfo.propTypes = {
  activeTrack: PropTypes.object,
  bandInfo: PropTypes.object,
  isPlaying: PropTypes.bool,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
};

export default function BandInfo(props) {
  return (
    <div className="d-flex">
      <Playlist
        activeTrack={props.activeTrack}
        isPlaying={props.isPlaying}
        changeActiveTrack={props.changeActiveTrack}
        changeIsPlaying={props.changeIsPlaying}
        bandInfo={props.bandInfo}
      />
      <TrackCover />
      <TrackDescription />
    </div>
  );
}