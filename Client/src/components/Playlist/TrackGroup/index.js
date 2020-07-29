import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { CSSTransition } from 'react-transition-group';

import { setCollapsedSongGroup } from '../../../store/actions';
import Track from '../Track';
import './index.scss';

TrackGroup.propTypes = {
  trackGroup: PropTypes.object,
  playerControl: PropTypes.object,
  trackGroupIndex: PropTypes.number,

  collapsedSongGroups: PropTypes.array,
  setCollapsedSongGroup: PropTypes.func,
};

const mapStateToProps = state => ({
  collapsedSongGroups: state.selectedBand.collapsedSongGroups,
});

const mapDispatchToProps = dispatch => ({
  setCollapsedSongGroup: (songGroupIndex, value) => dispatch(setCollapsedSongGroup(songGroupIndex, value)),
});

function TrackGroup(props) {
  const { trackGroup } = props;

  const constainsAltervative = trackGroup.songs && trackGroup.songs.length > 1;

  const masterTrack = trackGroup.songs.find(s => s.isMaster);

  const handleCollapsedClick = (value) => {
    props.setCollapsedSongGroup(props.trackGroupIndex, value);
  };

  const isCollapsed = props.collapsedSongGroups[props.trackGroupIndex];

  const getAlternativeTracksMarkup = () =>
    trackGroup.songs.filter(s => !s.isMaster).map((track, index) => 
      <Track
        key={index}
        track={track}
        playerControl={props.playerControl}
      />
    );

  return (
    <div className={isCollapsed && masterTrack ? 'collapsed' : ''}>
      {masterTrack && (
        <Track
          track={masterTrack}
          collapsed={isCollapsed}
          collapsedChange={handleCollapsedClick}
          constainsAltervative={constainsAltervative}
          playerControl={props.playerControl}
          mainVersion
        />
      )}

      {masterTrack ?
        (constainsAltervative && (
          <CSSTransition
            in={isCollapsed}
            timeout={300}
            classNames="track-group"
            unmountOnExit
          >
            <div>
              {getAlternativeTracksMarkup()}
            </div>
          </CSSTransition>
        )) : (
          <div>
            {getAlternativeTracksMarkup()}
          </div>
        )
    }
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(TrackGroup));
