import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import loadVideoJsLibrary from './load-videojs-lib';
import loadVideoJsHlsLibrary from './load-videojs-hls-lib';

VideoJS.propTypes = {
  activeTrack: PropTypes.object,
  volume: PropTypes.number,
  forcedCurrentPlayTime: PropTypes.number,
  isPlaying: PropTypes.bool,
  changeCurrentPlayTime: PropTypes.func,
};

export default function VideoJS(props) {

    const playerDomRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const { changeCurrentPlayTime } = props;

    useEffect(() => {
        const loadAmpLibrary = async () => {
          await loadVideoJsLibrary();
          await loadVideoJsHlsLibrary();
      
          const settings = {
            controls: false,
            autoplay: true,
            nativeControlsForTouch: false,
            width: '0',
            height: '0',
            poster: '',
          };
      
          setPlayer(window.videojs(playerDomRef.current, settings));
        };
    
        const handleTimeChange = () => {
          // changeCurrentPlayTime(Math.floor(player.currentTime()));
          changeCurrentPlayTime(player.currentTime());
        };
    
        const disposeResourses = () => {
          if (player) {
            player.off('timeupdate', handleTimeChange);
            player.dispose();
          }
        };
    
        loadAmpLibrary();
    
        if (player) {
          player.on('timeupdate', handleTimeChange);
        }
    
        return disposeResourses;
      }, [player, changeCurrentPlayTime]);

      useEffect(() => {
        if (props.activeTrack && player) {
          const link = props.activeTrack.streamLinks.find(sl => sl.type === 'Hls');
          player.src({
            src: link.url,
            type: "application/x-mpegURL",
          });
        }
      }, [props.activeTrack, player]);
    
      useEffect(() => {
        
        if (player) {
          if (props.isPlaying) {
            var playPromise = player.play();
            if (playPromise !== undefined) {
              playPromise.then(_ => {       
              })
              .catch(error => {
                console.error(error.message);
              });
            }
  
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