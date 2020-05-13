import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../Header';
import Player from '../Player';
import AzureMediaPlayer from '../AzureMediaPlayer';
import VideoJS from '../VideoJS';
import { getBandInfoByName } from '../../services/api-service';
import './index.scss';
import BandInfo from '../BandInfo';

export default function App() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [bandInfo, setBandInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [forcedCurrentPlayTime, setForcedCurrentPlayTime] = useState(0);
  const [playerControl, setPlayerControl] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getBandInfoByName('Modernova');
      setBandInfo(data);
    };

    loadData();
  }, []);

  return (
    <div className="root-container mx-5">
      <Header />
      <div>
        {activeTrack && (
          <Player
            isPlaying={isPlaying}
            activeTrack={activeTrack}
            volume={volume}
            currentPlayTime={currentPlayTime}
            changeIsPlaying={setIsPlaying}
            changeVolume={setVolume}
            setForcedCurrentPlayTime={setForcedCurrentPlayTime}
            playerControl = {playerControl}
          />
        )}
      </div>
      <VideoJS
        isPlaying={isPlaying}
        activeTrack={activeTrack}
        volume={volume}
        forcedCurrentPlayTime={forcedCurrentPlayTime}
        changeCurrentPlayTime={setCurrentPlayTime}
        setOuterControl={setPlayerControl}
      />

      <div className={`partial-view-container d-flex ${activeTrack ? 'visible-header' : ''}`}>
        <Switch>
          <Route path="/">
            {bandInfo ? (
              <BandInfo
                activeTrack={activeTrack}
                bandInfo={bandInfo}
                changeActiveTrack={setActiveTrack}
                changeIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                playerControl = {playerControl}
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
