import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaRandom } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { FiRepeat } from "react-icons/fi";
import { IoIosVolumeHigh } from "react-icons/io";
import Slider from '@material-ui/core/Slider';

import WaveformChart from '../WaveformChart';
import { secondsToMinutesFormat, getNextTrackForPlaylist, getPreviousTrackForPlaylist, getRandomTrack } from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';
import './index.scss';

Player.propTypes = {
  isPlaying: PropTypes.bool,
  isMasterFilterEnabled: PropTypes.bool,
  isRepeatFilterEnabled: PropTypes.bool,
  isRandomOrderEnabled: PropTypes.bool,
  activeTrack: PropTypes.object,
  currentPlayTime: PropTypes.number,
  changeIsPlaying: PropTypes.func,
  changeActiveTrack: PropTypes.func,
  changeMasterFilter: PropTypes.func,
  changeRepeatFilter: PropTypes.func,
  changeRandomOrder: PropTypes.func,
  playerControl: PropTypes.object,
  bandInfo: PropTypes.object,
};

function Player(props) {
  const waveformContainerRef = useRef(null);
  const [waveformContainerDimensions, setWaveformContainerDimensions] = useState({ width: 0, height: 0 });
  const [volume, setVolume] = useState(1);

  const handlePlayClick = () => {
    props.changeIsPlaying(!props.isPlaying);
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
    const nextTrack = props.isRandomOrderEnabled
      ? getRandomTrack(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterFilterEnabled)
      : getNextTrackForPlaylist(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterFilterEnabled);

    const link = nextTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);

    props.changeActiveTrack(nextTrack);
    props.playerControl.setSrc(link);

    if (props.isPlaying) {
      props.playerControl.play(); 
    }
  };

  const handlePreviousTrackIconClick = () => {
    const previousTrack = props.isRandomOrderEnabled
      ? getRandomTrack(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterFilterEnabled)
      : getPreviousTrackForPlaylist(props.bandInfo.album.songGroups, props.activeTrack.id, props.isMasterFilterEnabled);

    const link = previousTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);
    
    props.changeActiveTrack(previousTrack);
    props.playerControl.setSrc(link);

    if (props.isPlaying) {
      props.playerControl.play();
    }
  };

  const getPausePlayIcon = () => props.isPlaying
    ? <GiPauseButton className="icon mx-3" size="1.5em" onClick={handlePlayClick} />
    : <GiPlayButton className="icon mx-3" size="1.5em" onClick={handlePlayClick} />;

  const handleRepeatIconClick = () => props.changeRepeatFilter(!props.isRepeatFilterEnabled);

  const handleMasterIconClick = () => props.changeMasterFilter(!props.isMasterFilterEnabled);

  const handleRandomIconClick = () => props.changeRandomOrder(!props.isRandomOrderEnabled);

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
    <div className="player-container px-5">
      <div className="player-container-content pt-3">
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

        <div className="d-flex justify-content-between active-track pt-3">
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

        <div className="d-flex align-items-center py-3">
          <div className="d-flex justify-content-end col-5 p-0">
            <FaRandom
              className={"icon mx-3 " + (props.isRandomOrderEnabled ? 'active' : '')}
              onClick={handleRandomIconClick}
            />
            <div className="col-1"></div>
            <FiRepeat
              className={"icon mx-3 " + (props.isRepeatFilterEnabled ? 'active' : '')}
              onClick={handleRepeatIconClick}
            />
          </div>

          <div className="d-flex justify-content-center col-2 p-0 ">
            <MdSkipPrevious className="icon mx-3" size="1.6em" onClick={handlePreviousTrackIconClick} />
            {getPausePlayIcon()}
            <MdSkipNext className="icon mx-3" size="1.6em" onClick={handleNextTrackIconClick} />
          </div>

          <div className="d-flex align-items-center col-2 offset-1 p-0">
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

export default React.memo(Player);
