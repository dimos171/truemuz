import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from '../Header';
import Player from '../Player';
import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';
import AzureMediaPlayer from '../AzureMediaPlayer';
import './index.scss';

export default function App() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [forcedCurrentPlayTime, setForcedCurrentPlayTime] = useState(0);

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
          />
        )}
      </div>
      <AzureMediaPlayer
        isPlaying={isPlaying}
        activeTrack={activeTrack}
        volume={volume}
        forcedCurrentPlayTime={forcedCurrentPlayTime}
        changeCurrentPlayTime={setCurrentPlayTime}
      />

      <div className={`partial-view-container d-flex ${activeTrack ? 'visible-header' : ''}`}>
        <Switch>
          <Route path="/">
            <Playlist
              activeTrack={activeTrack}
              isPlaying={isPlaying}
              changeActiveTrack={setActiveTrack}
              changeIsPlaying={setIsPlaying}
            />
            <TrackCover />
            <TrackDescription />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
