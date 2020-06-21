import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';

import Header from '../Header';
import Player from '../Player';
import VideoJsPlayer from '../VideoJsPlayer';
import BandInfo from '../BandInfo';
import { getBandInfoByName } from '../../services/api-service';
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
  const [playerControl, setPlayerControl] = useState(null);
  const [isMasterFilterEnabled, setIsMasterFilterEnabled] = useState(false);
  const [isRepeatFilterEnabled, setIsRepeatFilterEnabled] = useState(false);
  const [isRandomOrderEnabled, setIsRandomOrderEnabled] = useState(false);
  const [collapsedSongGroups, setCollapsedSongGroups] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let data = await getBandInfoByName('Modernova');
      const album = data.albums[0];
      delete data.albums;
      data.album = album;

      setBandInfo(data);
      setCollapsedSongGroups(data.album.songGroups.map(() => false));
    };

    loadData();
  }, []);

  const getPlayerClass = () => activeTrack
    ? props.isTablet
      ? 'visible-player-mobile'
      : 'visible-player'
    : '';

  const changeCollapsedSongGroup = (index, value) => {
    const updatedCollapsedSongGroups = [...collapsedSongGroups];

    updatedCollapsedSongGroups[index] = value;
    setCollapsedSongGroups(updatedCollapsedSongGroups);
  };

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
            playerControl={playerControl}
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

      <VideoJsPlayer
        changeCurrentPlayTime={setCurrentPlayTime}
        setOuterControl={setPlayerControl}
      />

      <div className={`partial-view-container d-flex ${getPlayerClass()}`}>
        <Switch>
          <Route path="/">
            {bandInfo ? (
              <BandInfo
                activeTrack={activeTrack}
                changeActiveTrack={setActiveTrack}
                isPlaying={isPlaying}        
                changeIsPlaying={setIsPlaying}       
                playerControl={playerControl}
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
