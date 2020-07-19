import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { FaRandom } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { FiRepeat } from "react-icons/fi";
import { IoIosVolumeHigh } from "react-icons/io";
import Slider from '@material-ui/core/Slider';

import {
  setIsPlaying,
  setActiveTrack,
  setCollapsedSongGroup,
  setMasterMode,
  setRepeatMode,
  setRandomMode,
} from '../../store/actions';
import WaveformChart from '../WaveformChart';
import {
  secondsToMinutesFormat,
  getNextTrackForPlaylist,
  getPreviousTrackForPlaylist,
  getRandomTrack,
  getActiveSongGroupAndTrack,
} from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';
import './index.scss';

Player.propTypes = {
  playerControl: PropTypes.object,
  bandInfo: PropTypes.object,

  activeTrack: PropTypes.object,
  currentPlayTime: PropTypes.number,
  isPlaying: PropTypes.bool,
  isMasterModeEnabled: PropTypes.bool,
  isRepeatModeEnabled: PropTypes.bool,
  isRandomModeEnabled: PropTypes.bool,
  setIsPlaying: PropTypes.func,
  setActiveTrack: PropTypes.func,
  setCollapsedSongGroup: PropTypes.func,
  setMasterMode: PropTypes.func,
  setRepeatMode: PropTypes.func,
  setRandomMode: PropTypes.func,
};

const mapStateToProps = state => ({
  activeTrack: state.selectedBand.activeTrack,
  isPlaying: state.player.isPlaying,
  isMasterModeEnabled: state.player.isMasterModeEnabled,
  isRepeatModeEnabled: state.player.isRepeatModeEnabled,
  isRandomModeEnabled: state.player.isRandomModeEnabled,
  currentPlayTime: state.player.currentPlayTime,
});

const mapDispatchToProps = dispatch => ({
  setActiveTrack: (activeTrack) => dispatch(setActiveTrack(activeTrack)),
  setCollapsedSongGroup: (songGroupIndex, value) => dispatch(setCollapsedSongGroup(songGroupIndex, value)),
  setIsPlaying: (isPlaying) => dispatch(setIsPlaying(isPlaying)),
  setMasterMode: (isMasterModeEnabled) => dispatch(setMasterMode(isMasterModeEnabled)),
  setRepeatMode: (isRepeatModeEnabled) => dispatch(setRepeatMode(isRepeatModeEnabled)),
  setRandomMode: (isRandomModeEnabled) => dispatch(setRandomMode(isRandomModeEnabled)),
});

function Player(props) {
  const waveformContainerRef = useRef(null);
  const [waveformContainerDimensions, setWaveformContainerDimensions] = useState({ width: 0, height: 0 });
  const [volume, setVolume] = useState(1);

  const handlePlayClick = () => {
    props.setIsPlaying(!props.isPlaying);
    // Safari can start play only in user action event context
    // Also the same fix applied in Track component
    if (!props.isPlaying) {
      props.playerControl.play();
    } else {
      props.playerControl.pause();
    }
  };
  
  props.playerControl.setVolume(volume);

  const getVolumeForSlider = () =>  volume * 100;
  
  const handleChangeVolume = (event, changedVolume) => setVolume(changedVolume / 100);

  const handleNextTrackIconClick = () => {
    const nextTrack = props.isRandomModeEnabled
      ? getRandomTrack(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterModeEnabled)
      : getNextTrackForPlaylist(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterModeEnabled);

    const link = nextTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);

    props.setActiveTrack(nextTrack);
    props.setIsPlaying(true);
    props.playerControl.setSrc(link);
    props.playerControl.play();

    if (!nextTrack.isMaster) {
      const { activeSongGroupPosition } = getActiveSongGroupAndTrack(props.bandInfo.album.songGroups, nextTrack.id);
      
      props.setCollapsedSongGroup(activeSongGroupPosition, true);
    }
  };

  const handlePreviousTrackIconClick = () => {
    const previousTrack = props.isRandomModeEnabled
      ? getRandomTrack(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterModeEnabled)
      : getPreviousTrackForPlaylist(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterModeEnabled);

    const link = previousTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);
    
    props.setActiveTrack(previousTrack);
    props.setIsPlaying(true);
    props.playerControl.setSrc(link);
    props.playerControl.play();

    if (!previousTrack.isMaster) {
      const { activeSongGroupPosition } = getActiveSongGroupAndTrack(props.bandInfo.album.songGroups, previousTrack.id);

      props.setCollapsedSongGroup(activeSongGroupPosition, true);
    }
  };

  const getPausePlayIcon = () => props.isPlaying
    ? <GiPauseButton className="icon" size="1.5em" onClick={handlePlayClick} />
    : <GiPlayButton className="icon" size="1.5em" onClick={handlePlayClick} />;

  const handleRepeatIconClick = () => props.setRepeatMode(!props.isRepeatModeEnabled);

  const handleMasterIconClick = () => props.setMasterMode(!props.isMasterModeEnabled);

  const handleRandomIconClick = () => props.setRandomMode(!props.isRandomModeEnabled);

  useEffect(() => {
    const setDimensions = () => {
      setWaveformContainerDimensions({
        width: waveformContainerRef.current.offsetWidth,
        height: waveformContainerRef.current.offsetHeight,
      });
    };

    const handleWindowResize = () => {
      setDimensions();
    };

    const disposeResources = () => {
      window.removeEventListener('resize', handleWindowResize);
    };

    if (waveformContainerRef.current) {
      setDimensions();
      window.addEventListener('resize', handleWindowResize);
    }

    return disposeResources;
  }, [waveformContainerRef]);

  return (
    <div className="player-container px-3 px-md-5">
      <div className="player-container-content pt-2">
        <div
          ref={waveformContainerRef}
          className="waveform-container"
        >
          {(waveformContainerDimensions.width > 0 && waveformContainerDimensions.height > 0) && (
            <WaveformChart
              width={waveformContainerDimensions.width}
              height={waveformContainerDimensions.height}
              activeTrack={props.activeTrack}
              currentPlayTime={props.currentPlayTime}
              setForcedCurrentPlayTime={props.playerControl.setCurrentTime}
            />
          )}
        </div>

        <div className="d-flex justify-content-between active-track pt-2">
          <div className="current-time">
            {secondsToMinutesFormat(props.currentPlayTime)}
          </div>
          <div>
            {props.activeTrack.name}
          </div>
          <div className="total-time">
            {secondsToMinutesFormat(props.activeTrack.duration)}
          </div>
        </div>

        <div className="d-flex align-items-center py-2">
          <div className="d-flex justify-content-end col-4 col-lg-5 p-0">
            <FaRandom
              className={"icon mx-3 " + (props.isRandomModeEnabled ? 'active' : '')}
              onClick={handleRandomIconClick}
            />
            <div className="col-1 d-none d-md-block"></div>
            <FiRepeat
              className={"icon mx-3 mr-md-4 mr-xl-5 " + (props.isRepeatModeEnabled ? 'active' : '')}
              onClick={handleRepeatIconClick}
            />
          </div>

          <div className="player-container-content-play-controls d-flex col-4 col-lg-2 p-0 ">
            <MdSkipPrevious className="icon" size="1.6em" onClick={handlePreviousTrackIconClick} />
            {getPausePlayIcon()}
            <MdSkipNext className="icon" size="1.6em" onClick={handleNextTrackIconClick} />
          </div>

          <div className="d-flex align-items-center col-4 col-lg-2 offset-lg-1 p-0">
            <IoIosVolumeHigh className="icon mr-3" size="1.6em" />
            <Slider
              aria-labelledby="continuous-slider"
              className="volume-slider"
              value={getVolumeForSlider()}
              onChange={handleChangeVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(Player));
