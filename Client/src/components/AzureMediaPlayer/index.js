import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import loadLibrary from './load-amp-library';

AzureMediaPlayer.propTypes = {
  activeTrack: PropTypes.object,
  volume: PropTypes.number,
  forcedCurrentPlayTime: PropTypes.number,
  isPlaying: PropTypes.bool,
  changeCurrentPlayTime: PropTypes.func,
};

export default function AzureMediaPlayer(props) {

  const playerDomRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const { changeCurrentPlayTime } = props;

  useEffect(() => {
    const loadAmpLibrary = async () => {
      await loadLibrary();
  
      const settings = {
        controls: false,
        autoplay: false,
        nativeControlsForTouch: false,
        width: '0',
        height: '0',
        poster: '',
      };
  
      setPlayer(window.amp(playerDomRef.current, settings));
    };

    const handleTimeChange = () => {
      // changeCurrentPlayTime(Math.floor(player.currentTime()));
      changeCurrentPlayTime(player.currentTime());
    };

    const disposeResourses = () => {
      if (player) {
        player.removeEventListener('timeupdate', handleTimeChange);
        player.dispose();
      }
    };

    loadAmpLibrary();

    if (player) {
      player.addEventListener('timeupdate', handleTimeChange);
    }

    return disposeResourses;
  }, [player, changeCurrentPlayTime]);

  useEffect(() => {
    if (props.activeTrack && player) {
      const link = props.activeTrack.streamLinks.find(sl => sl.type === 'Smooth');
      
      player.src([{
        "src": link.url,
        // "type": props.activeTrack.type,
      }]);
    }
  }, [props.activeTrack, player]);

  useEffect(() => {
    if (player) {
      if (props.isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [props.isPlaying, player]);

  useEffect(() => {
    if (player) {
      player.volume(props.volume);
    }
  }, [props.volume, player]);

  useEffect(() => {
    if (player && props.forcedCurrentPlayTime >= 0) {
      player.currentTime(props.forcedCurrentPlayTime);
    }
  }, [props.forcedCurrentPlayTime, player]);
  
  return (
    <video
      id="amp-player"
      className="d-none"
      ref={playerDomRef}
    >
    </video>
  );
}
