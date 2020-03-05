import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import Header from '../Header';
import Player from '../Player';
import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';
import './index.scss';

App.propTypes = {
  title: PropTypes.string
};

export default function App(props) {
  const [count, setCount] = useState(0);

  return (
    <div className="root-container mx-5">
      <Header />
      <Player />

      <div className="partial-view-container d-flex">
        <Switch>
          <Route path="/">
            <Playlist />
            <TrackCover />
            <TrackDescription />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
