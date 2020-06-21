import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Switch, Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';

import Header from '../Header';
import Player from '../Player';
import VideoJsPlayer from '../VideoJsPlayer';
import BandInfo from '../BandInfo';
import { getBandInfoByName } from '../../services/api-service';
import { getNextTrackForPlaylist, getRandomTrack, getActiveSongGroupAndTrack } from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';
import './index.scss';

App.propTypes = {
  isTablet: PropTypes.bool,
};

const mapSizesToProps = ({ width }) => ({
  isTablet: width < 992,
});

function App(props) {
  const [activeTrack, setActiveTrack] = useState(null);
  const [bandInfo, setBandInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [isMasterFilterEnabled, setIsMasterFilterEnabled] = useState(false);
  const [isRepeatFilterEnabled, setIsRepeatFilterEnabled] = useState(false);
  const [isRandomOrderEnabled, setIsRandomOrderEnabled] = useState(false);
  const [collapsedSongGroups, setCollapsedSongGroups] = useState([]);
  const videoJsPlayerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      let data = await getBandInfoByName('Modernova');
      const album = data.albums[0];
      delete data.albums;
      data.album = album;

      setBandInfo(data);
      setCollapsedSongGroups(data.album.songGroups.map(() => false));

      videoJsPlayerRef.current.setEventHandler('timeupdate', handleTimeChange);
    };

    loadData();
  }, []);

  const changeCollapsedSongGroup = useCallback(
    (index, value) => {
      const updatedCollapsedSongGroups = [...collapsedSongGroups];

      updatedCollapsedSongGroups[index] = value;
      setCollapsedSongGroups(updatedCollapsedSongGroups);
    }, [collapsedSongGroups]);

  useEffect(() => {
    const handleTrackEnd = () => {
      if (!isRepeatFilterEnabled) {
        const nextTrack = isRandomOrderEnabled
          ? getRandomTrack(bandInfo.album.songGroups, activeTrack.id, isMasterFilterEnabled)
          : getNextTrackForPlaylist(bandInfo.album.songGroups, activeTrack.id, isMasterFilterEnabled);

        const link = nextTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS);

        setActiveTrack(nextTrack);
        videoJsPlayerRef.current.setSrc(link);

        if (!nextTrack.isMaster) {
          const { activeSongGroupPosition } = getActiveSongGroupAndTrack(bandInfo.album.songGroups, nextTrack.id);
          
          changeCollapsedSongGroup(activeSongGroupPosition, true);
        }
      }

      setCurrentPlayTime(0);
      videoJsPlayerRef.current.play();
    };

    if (videoJsPlayerRef && videoJsPlayerRef.current && videoJsPlayerRef.current.isPlayerReady()) {
      videoJsPlayerRef.current.removeEventHandler('ended');
      videoJsPlayerRef.current.setEventHandler('ended', handleTrackEnd);
    }
  }, [isRepeatFilterEnabled, isRandomOrderEnabled, isMasterFilterEnabled, bandInfo, activeTrack, changeCollapsedSongGroup]);

  const handleTimeChange = () => {
    setCurrentPlayTime(videoJsPlayerRef.current.getCurrentPlayTime());
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
            activeTrack={activeTrack}
            changeActiveTrack={setActiveTrack}    
            isPlaying={isPlaying}
            changeIsPlaying={setIsPlaying}
            playerControl={videoJsPlayerRef.current}
            bandInfo={bandInfo}
            currentPlayTime={currentPlayTime}
            isMasterFilterEnabled={isMasterFilterEnabled}
            isRepeatFilterEnabled={isRepeatFilterEnabled}
            isRandomOrderEnabled={isRandomOrderEnabled}
            changeMasterFilter={setIsMasterFilterEnabled}
            changeRepeatFilter={setIsRepeatFilterEnabled}
            changeRandomOrder={setIsRandomOrderEnabled}
            changeCollapsedSongGroup={changeCollapsedSongGroup}
          />
        )}
      </div>

      <VideoJsPlayer ref={videoJsPlayerRef} />

      <div className={`partial-view-container d-flex ${getPlayerClass()}`}>
        <Switch>
          <Route path="/">
            {bandInfo ? (
              <BandInfo
                activeTrack={activeTrack}
                changeActiveTrack={setActiveTrack}
                isPlaying={isPlaying}        
                changeIsPlaying={setIsPlaying}       
                playerControl={videoJsPlayerRef.current}
                bandInfo={bandInfo}
                collapsedSongGroups={collapsedSongGroups}
                changeCollapsedSongGroup={changeCollapsedSongGroup}
              />
            ) : (
              <div>
                <CircularProgress />
              </div>
            )}
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default withSizes(mapSizesToProps)(App);
