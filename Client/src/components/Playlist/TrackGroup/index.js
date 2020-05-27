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
  changeWikiTrack: PropTypes.func,
  wikiTrack: PropTypes.object,
  playerControl: PropTypes.object,
};

function TrackGroup(props) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    trackGroup,
    activeTrack,
    isPlaying,
    changeActiveTrack,
    changeIsPlaying,
    changeWikiTrack,
    wikiTrack,
  } = props;

  const constainsAltervative = trackGroup.songs && trackGroup.songs.length > 1;

  const isActiveTrack = (activeTrack, track) => activeTrack != null && activeTrack.id === track.id;
  const isActiveWiki = (wikiTrack, track) => wikiTrack != null && wikiTrack.id === track.id;

  const masterTrack = trackGroup.songs.find(s => s.isMaster);

  const getAlternativeTracksMarkup = () =>
    trackGroup.songs.filter(s => !s.isMaster).map((track, index) => 
      <Track
        key={index}
        track={track}
        isActiveTrack={isActiveTrack(activeTrack, track)}
        isActiveWiki={isActiveWiki(wikiTrack, track)}
        isPlaying={isPlaying}
        changeActiveTrack={changeActiveTrack}
        changeIsPlaying={changeIsPlaying}
        changeWikiTrack={changeWikiTrack}
        playerControl={props.playerControl}
      />
    );

  return (
    <div className={collapsed ? 'collapsed' : ''}>
      <Track
        track={masterTrack}
        collapsed={collapsed}
        collapsedChange={setCollapsed}
        constainsAltervative={constainsAltervative}
        isActiveTrack={isActiveTrack(activeTrack, masterTrack)}
        isActiveWiki={isActiveWiki(wikiTrack, masterTrack)}
        isPlaying={isPlaying}
        changeActiveTrack={changeActiveTrack}
        changeIsPlaying={changeIsPlaying}
        changeWikiTrack={changeWikiTrack}
        playerControl={props.playerControl}
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

export default React.memo(TrackGroup);
