import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

import loadVideoJsLibrary from './load-videojs-lib';

function VideoJsPlayer(props, ref) {
  const playerDomRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useImperativeHandle(ref, () => ({
    isPlayerReady: () => player,
    play: () => {
      player.play();
    },
    pause: () => {
      player.pause();
    },
    setVolume: (value) => {
      player.volume(value);
    },
    setCurrentTime: (value) => {
      player.currentTime(value);
    },
    setSrc: (value) => {
      player.src({
        //src: value.url, TODO Use this on PROD.
        src: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
        type: "application/x-mpegURL",
      });
    },
    setEventHandler: (eventName, eventHandler) => {
      player.on(eventName, eventHandler);
    },
    removeEventHandler: (eventName) => {
      player.off(eventName);
    },
    getCurrentPlayTime: () => player.currentTime(),
  }));

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
    };

    loadLibrary();
  }, []);

  return (
    <video
      id="amp-player"
      className="d-none"
      ref={playerDomRef}
      playsInline
    ></video>
  );
}

export default React.memo(forwardRef(VideoJsPlayer));
