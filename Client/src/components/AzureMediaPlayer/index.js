import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import loadLibrary from './load-amp-library';

AzureMediaPlayer.propTypes = {
  activeTrack: PropTypes.object,
  volume: PropTypes.number,
  isPlaying: PropTypes.bool,
};

export default function AzureMediaPlayer(props) {
  const playerDomRef = useRef(null);
  const [player, setPlayer] = useState(null);

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

  const disposePlayer = () => {
    player && player.dispose();
  };

  useEffect(() => {
    loadAmpLibrary();

    // todo: google workaround about eslint warning or approach
    return disposePlayer;
  }, []);

  useEffect(() => {
    if (props.activeTrack && player) {
      player.src([{
        "src": props.activeTrack.url,
        "type": props.activeTrack.type,
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
  
  return (
    <video
      id="amp-player"
      className="d-none"
      ref={playerDomRef}
    >
    </video>
  );
}
