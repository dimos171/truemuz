import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import loadVideoJsLibrary from './load-videojs-lib';
import loadVideoJsHlsLibrary from './load-videojs-hls-lib';
import { streamLinkType } from '../../shared/enums/streamLinkType';

VideoJsPlayer.propTypes = {
  activeTrack: PropTypes.object,
  changeCurrentPlayTime: PropTypes.func,
  setOuterControl: PropTypes.func,
};

export default function VideoJsPlayer(props) {
  const playerDomRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const { changeCurrentPlayTime, setOuterControl } = props;

  useEffect(() => {
    const loadLibrary = async () => {
      await Promise.all([loadVideoJsLibrary(), loadVideoJsHlsLibrary()]);
  
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
        setCurrentTime: (value) => { player.currentTime(value) }
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

  useEffect(() => {
    if (props.activeTrack && player) {
      const link = props.activeTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);
      player.src({
        src: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
        //link.url,
        type: "application/x-mpegURL",
      });
    }
  }, [props.activeTrack, player]);

  return (
    <video
      id="amp-player"
      className="d-none"
      ref={playerDomRef}
    >
    </video>
  );
}