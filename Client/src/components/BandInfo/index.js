import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';
import { getActiveSongGroupAndTrack } from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';
import './index.scss';

BandInfo.propTypes = {
  activeTrack: PropTypes.object,
  bandInfo: PropTypes.object,
  playerControl: PropTypes.object,
  isPlaying: PropTypes.bool,
  collapsedSongGroups: PropTypes.array,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
  changeCollapsedSongGroup: PropTypes.func,
};

function BandInfo(props) {
  const [wiki, setWiki] = useState('');
  const [wikiTrack, setWikiTrack] = useState(null);

  const { bandInfo } = props;

  const handleTrackClickInDescription = (targetTrackId) => {
    const {
      activeSongGroup,
      activeSongGroupPosition,
      activeTrackPosition,
    } = getActiveSongGroupAndTrack(bandInfo.album.songGroups, targetTrackId);

    const selectedTrack = activeSongGroup.songs[activeTrackPosition];
    
    props.changeActiveTrack(selectedTrack);
    props.changeIsPlaying(true);
    props.playerControl.setSrc(selectedTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS));
    props.playerControl.play();

    if (!selectedTrack.isMaster) {
      props.changeCollapsedSongGroup(activeSongGroupPosition, true);
    }
  };

  const isPlayerVisible = () => props.activeTrack !== null;

  useEffect(() => {
    if (wikiTrack) {
      const songGroup = bandInfo.album.songGroups
        .find(songGroup => songGroup.songs.find(s => s.id == wikiTrack.id));

      setWiki(songGroup.wiki);
    }
  }, [wikiTrack, bandInfo]);

  return (
    <div className="d-flex band-info-container w-100">
      <Playlist
        activeTrack={props.activeTrack}
        isPlaying={props.isPlaying}
        collapsedSongGroups={props.collapsedSongGroups}
        changeActiveTrack={props.changeActiveTrack}
        changeIsPlaying={props.changeIsPlaying}
        changeWikiTrack={setWikiTrack}
        changeCollapsedSongGroup={props.changeCollapsedSongGroup}
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
        isPlayerVisible={isPlayerVisible()}
        changeTrack={handleTrackClickInDescription}
      />
    </div>
  );
}

export default React.memo(BandInfo);
