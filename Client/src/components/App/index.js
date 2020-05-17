import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../Header';
import Player from '../Player';
import VideoJsPlayer from '../VideoJsPlayer';
import BandInfo from '../BandInfo';
import { getBandInfoByName } from '../../services/api-service';
import './index.scss';

export default function App() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [bandInfo, setBandInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
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
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            changeIsPlaying={setIsPlaying}          
            currentPlayTime={currentPlayTime}
            playerControl={playerControl}
          />
        )}
      </div>
      <VideoJsPlayer
        activeTrack={activeTrack}
        changeCurrentPlayTime={setCurrentPlayTime}
        setOuterControl={setPlayerControl}
      />

      <div className={`partial-view-container d-flex ${activeTrack ? 'visible-header' : ''}`}>
        <Switch>
          <Route path="/">
            {bandInfo ? (
              <BandInfo
                activeTrack={activeTrack}
                changeActiveTrack={setActiveTrack}
                isPlaying={isPlaying}        
                changeIsPlaying={setIsPlaying}       
                playerControl = {playerControl}
                bandInfo={bandInfo}
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
