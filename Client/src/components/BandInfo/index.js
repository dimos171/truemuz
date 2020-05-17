import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';

BandInfo.propTypes = {
  activeTrack: PropTypes.object,
  bandInfo: PropTypes.object,
  isPlaying: PropTypes.bool,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
  playerControl: PropTypes.object,
};

export default function BandInfo(props) {
  const [ wiki, setWiki ] = useState('');
  const [ wikiTrack, setWikiTrack] = useState(null);

  useEffect(() => {
    if(wikiTrack) {
      var songGroup = props.bandInfo.albums[0].songGroups.find((songGroup) => {
        return songGroup.songs.find(s => s.id == wikiTrack.id);
      });
      setWiki(songGroup.wiki);
    }
  }, [wikiTrack]);

  return (
    <div className="d-flex">
      <Playlist
        activeTrack={props.activeTrack}
        isPlaying={props.isPlaying}
        changeActiveTrack={props.changeActiveTrack}
        changeIsPlaying={props.changeIsPlaying}
        changeWikiTrack={setWikiTrack}
        bandInfo={props.bandInfo}
        playerControl = {props.playerControl}
      />
      <TrackCover />
      <TrackDescription 
        wiki={wiki}/>
    </div>
  );
}