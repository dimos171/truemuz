import React, { useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';

import Header from '../Header';
import Player from '../Player';
import VideoJsPlayer from '../VideoJsPlayer';
import BandInfo from '../BandInfo';
import { getNextTrackForPlaylist, getRandomTrack, getActiveSongGroupAndTrack } from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';
import { setActiveTrack, setCollapsedSongGroup, setCurrentPlayTime } from '../../store/actions';
import './index.scss';

App.propTypes = {
  isTablet: PropTypes.bool,
  bandInfo: PropTypes.object,
  activeTrack: PropTypes.object,
  filteredSongGroups: PropTypes.array,
  isMasterModeEnabled: PropTypes.bool,
  isRepeatModeEnabled: PropTypes.bool,
  isRandomModeEnabled: PropTypes.bool,
  setActiveTrack: PropTypes.func,
  setCollapsedSongGroup: PropTypes.func,
  setCurrentPlayTime: PropTypes.func,
};

const mapSizesToProps = ({ width }) => ({
  isTablet: width < 992,
});

const mapStateToProps = state => ({
  activeTrack: state.selectedBand.activeTrack,
  filteredSongGroups: state.selectedBand.filteredSongGroups,
  isMasterModeEnabled: state.player.isMasterModeEnabled,
  isRepeatModeEnabled: state.player.isRepeatModeEnabled,
  isRandomModeEnabled: state.player.isRandomModeEnabled,
});

const mapDispatchToProps = dispatch => ({
  setActiveTrack: (activeTrack) => dispatch(setActiveTrack(activeTrack)),
  setCollapsedSongGroup: (songGroupIndex, value) => dispatch(setCollapsedSongGroup(songGroupIndex, value)),
  setCurrentPlayTime: (currentPlayTime) => dispatch(setCurrentPlayTime(currentPlayTime)),
});

function App(props) {
  const videoJsPlayerRef = useRef(null);

  const {
    activeTrack,
    filteredSongGroups,
    isMasterModeEnabled,
    isRepeatModeEnabled,
    isRandomModeEnabled,
    setActiveTrack,
    setCollapsedSongGroup,
    setCurrentPlayTime,
  } = props;

  useEffect(() => {
    const handleTrackEnd = () => {
      if (!isRepeatModeEnabled) {
        const nextTrack = isRandomModeEnabled
          ? getRandomTrack(filteredSongGroups, activeTrack.id, isMasterModeEnabled)
          : getNextTrackForPlaylist(filteredSongGroups, activeTrack.id, isMasterModeEnabled);

        const link = nextTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);

        setActiveTrack(nextTrack);
        videoJsPlayerRef.current.setSrc(link);

        if (!nextTrack.isMaster) {
          const { activeSongGroupPosition } = getActiveSongGroupAndTrack(filteredSongGroups, nextTrack.id);
          
          setCollapsedSongGroup(activeSongGroupPosition, true);
        }
      }

      setCurrentPlayTime(0);
      videoJsPlayerRef.current.play();
    };

    if (videoJsPlayerRef && videoJsPlayerRef.current && videoJsPlayerRef.current.isPlayerReady()) {
      videoJsPlayerRef.current.removeEventHandler('ended');
      videoJsPlayerRef.current.setEventHandler('ended', handleTrackEnd);
    }
  }, [isRepeatModeEnabled, isRandomModeEnabled, isMasterModeEnabled, filteredSongGroups, activeTrack, setCollapsedSongGroup, setActiveTrack, setCurrentPlayTime]);

  const setupEvents = () => {
    const handleTimeChange = () => {
      setCurrentPlayTime(videoJsPlayerRef.current.getCurrentPlayTime());
    };

    videoJsPlayerRef.current.setEventHandler('timeupdate', handleTimeChange);
  };
  
  const getPlayerClass = () => activeTrack
    ? props.isTablet
      ? 'visible-player-mobile'
      : 'visible-player'
    : '';

  return (
    <div className="root-container mx-3 mx-md-5">
      <Header />
      <div>
        {activeTrack && (
          <Player
            playerControl={videoJsPlayerRef.current}
            filteredSongGroups={filteredSongGroups}
          />
        )}
      </div>

      <VideoJsPlayer
        ref={videoJsPlayerRef}
        isReady={setupEvents}
      />

      <div className={`partial-view-container d-flex ${getPlayerClass()}`}>
        <Switch>
          <Route exact path="/band/:bandName">
            <BandInfo playerControl={videoJsPlayerRef.current} />
          </Route>
          <Route path="/">
            <Redirect to="/band/Modernova" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSizes(mapSizesToProps)(App));
