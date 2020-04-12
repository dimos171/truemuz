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

  return (
    <div className="root-container mx-5">
      <Header />
      <Player
        isPlaying={isPlaying}
        activeTrack={activeTrack}
        volume={volume}
        changeIsPlaying={setIsPlaying}
        changeVolume={setVolume}
      />
      <AzureMediaPlayer
        isPlaying={isPlaying}
        activeTrack={activeTrack}
        volume={volume}
      />

      <div className="partial-view-container d-flex">
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
