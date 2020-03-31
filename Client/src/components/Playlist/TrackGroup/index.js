import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Track from '../Track';
import './index.scss';

TrackGroup.propTypes = {
  trackGroup: PropTypes.object,
  activeTrack: PropTypes.object,
  isPlaying: PropTypes.bool,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func, 
};

export default function TrackGroup(props) {
  const [ collapsed, setCollapsed ] = useState(false);

  const {
    trackGroup,
    activeTrack,
    isPlaying,
    changeActiveTrack,
    changeIsPlaying,
  } = props;

  const constainsAltervative = trackGroup.alternativeTracks && trackGroup.alternativeTracks.length > 0;

  const isActiveTrack = (activeTrack, track) => activeTrack != null && activeTrack.id === track.id;

  const getAlternativeTracksMarkup = () =>
    trackGroup.alternativeTracks.map((track, index) => 
      <Track
        key={index}
        track={track}
        isActiveTrack={isActiveTrack(activeTrack, track)}
        isPlaying={isPlaying}
        changeActiveTrack={changeActiveTrack}
        changeIsPlaying={changeIsPlaying}
      />
    );

  return (
    <div className={collapsed ? 'collapsed' : ''}>
      <Track
        track={trackGroup}
        collapsed={collapsed}
        collapsedChange={setCollapsed}
        constainsAltervative={constainsAltervative}
        isActiveTrack={isActiveTrack(activeTrack, trackGroup)}
        isPlaying={isPlaying}
        changeActiveTrack={changeActiveTrack}
        changeIsPlaying={changeIsPlaying}
        mainVersion
      />

      {constainsAltervative && (
        <CSSTransition
          in={collapsed}
          timeout={300}
          classNames="track-group"
          unmountOnExit
        >
          <div>
            {getAlternativeTracksMarkup()}
          </div>
        </CSSTransition>
      )}
    </div>
  );
}
