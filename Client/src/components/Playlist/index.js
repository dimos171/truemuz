import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TrackGroup from './TrackGroup';

const trackGroups = [
  { 
    name: 'Hitchhiking the Air #1',
    length: '03:21',
    id: '1',
    alternativeTracks: [ 
      {
        name: 'Alternative track #2',
        length: '03:20',
        id: '2',
      },
      {
        name: 'Alternative track #3',
        length: '03:20',
        id: '3',
      },
      {
        name: 'Alternative track #4',
        length: '03:20',
        id: '4',
      },
    ],
  },
  {
    name: 'Hitchhiking the Air #2',
    length: '03:23',
    id: '5',
    alternativeTracks: [],
  },
  {
    name: 'Hitchhiking the Air #3',
    length: '03:23',
    id: '6',
    alternativeTracks: [ 
      {
        name: 'Alternative track #2',
        length: '03:20',
        id: '7',
      },
      {
        name: 'Alternative track #3',
        length: '03:20',
        id: '8',
      },
      {
        name: 'Alternative track #4',
        length: '03:20',
        id: '9',
      },
    ],
  },
];

Playlist.propTypes = {
  activeTrack: PropTypes.object,
  isPlaying: PropTypes.bool,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
};

export default function Playlist(props) {
  return (
    <div className="col-5 px-0 mt-3 pt-2">
      <div className="playlist-description mb-3 pb-2">
        <h5 className="mb-3 pb-2">
          PLAYLIST
        </h5>
        <div className="d-flex">
          <div className="light-text pr-1">Band:</div>
          <div>Modernova</div>
        </div>
        <div className="d-flex">
          <div className="light-text pr-1">Album:</div>
          <div>Do what you feel</div>
        </div>
        <div className="small-text">
          4 main tracks, 6 alternative versions
        </div>
      </div>

      <div className="playlist-tracks ml-n5">
        {trackGroups.map((trackGroup, index) =>
          <TrackGroup
            key={index}
            trackGroup={trackGroup}
            activeTrack={props.activeTrack}
            isPlaying={props.isPlaying}
            changeActiveTrack={props.changeActiveTrack}
            changeIsPlaying={props.changeIsPlaying}
          />
        )}
      </div>
    </div>
  );
}
