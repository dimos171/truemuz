import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';
import { getActiveSongGroupAndTrack } from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';

BandInfo.propTypes = {
  activeTrack: PropTypes.object,
  bandInfo: PropTypes.object,
  isPlaying: PropTypes.bool,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
  playerControl: PropTypes.object,
};

function BandInfo(props) {
  const { bandInfo } = props;

  const [wiki, setWiki] = useState('');
  const [wikiTrack, setWikiTrack] = useState(null);

  const handleTrackClickInDescription = (targetTrackId) => {
    const {
      activeSongGroup,
      activeTrackPosition,
    } = getActiveSongGroupAndTrack(bandInfo.album.songGroups, targetTrackId);

    const selectedTrack = activeSongGroup.songs[activeTrackPosition];
    
    props.changeActiveTrack(selectedTrack);
    props.playerControl.setSrc(selectedTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS));
    props.playerControl.play();

    if (!props.isPlaying) {
      props.changeIsPlaying(!props.isPlaying);    
    }

    setWikiTrack(selectedTrack);
  };

  useEffect(() => {
    if (wikiTrack) {
      const songGroup = bandInfo.album.songGroups
        .find(songGroup => songGroup.songs.find(s => s.id == wikiTrack.id));

      setWiki(songGroup.wiki);
    }
  }, [wikiTrack, bandInfo]);

  return (
    <div className="d-flex">
      <Playlist
        activeTrack={props.activeTrack}
        isPlaying={props.isPlaying}
        changeActiveTrack={props.changeActiveTrack}
        changeIsPlaying={props.changeIsPlaying}
        changeWikiTrack={setWikiTrack}
        wikiTrack={wikiTrack}
        bandInfo={bandInfo}
        playerControl={props.playerControl}
      />

      <TrackCover 
        bandName={bandInfo.name}
        albumName={bandInfo.album.name}
        members={bandInfo.members}
        socialNet={bandInfo.socialNet}
      />

      <TrackDescription 
        wiki={wiki}
        changeTrack={handleTrackClickInDescription}
      />
    </div>
  );
}

export default React.memo(BandInfo);
