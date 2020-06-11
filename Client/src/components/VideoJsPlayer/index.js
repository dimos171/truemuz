import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import loadVideoJsLibrary from './load-videojs-lib';

VideoJsPlayer.propTypes = {
  changeCurrentPlayTime: PropTypes.func,
  setOuterControl: PropTypes.func,
};

function VideoJsPlayer(props) {
  const playerDomRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const { changeCurrentPlayTime, setOuterControl } = props;

  useEffect(() => {
    const loadLibrary = async () => {
      await loadVideoJsLibrary();
  
      const settings = {
        controls: false,
        autoplay: false,
        nativeControlsForTouch: false,
        width: '0',
        height: '0',
        poster: '',
      };
      
      setPlayer(window.videojs(playerDomRef.current, settings));

      setOuterControl({
        play: () => { player.play() },
        pause: () => { player.pause() },
        setVolume: (value) => { player.volume(value) },
        setCurrentTime: (value) => { player.currentTime(value) },
        setSrc: (value) => {
          player.src({
            //src: value.url, TODO Use this on PROD.
            src: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
            type: "application/x-mpegURL",
          });
        },
      });
    };
  
    const handleTimeChange = () => {
      changeCurrentPlayTime(player.currentTime());
    };
  
    const disposeResourses = () => {
      if (player) {
        player.off('timeupdate', handleTimeChange);
        player.dispose();
      }
    };

    loadLibrary();

    if (player) {
      player.on('timeupdate', handleTimeChange);
    }

    return disposeResourses;
  }, [player, changeCurrentPlayTime, setOuterControl]);

  return (
    <video
      id="amp-player"
      className="d-none"
      ref={playerDomRef}
      playsInline
    ></video>
  );
}

export default React.memo(VideoJsPlayer);
