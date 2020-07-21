import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

import Playlist from '../Playlist';
import TrackDescription from '../TrackDescription';
import TrackCover from '../TrackCover';
import { loadBandInfo, setActiveTrack, setIsPlaying, setCollapsedSongGroup } from '../../store/actions';
import { getActiveSongGroupAndTrack } from '../../shared/utilities';
import { streamLinkType } from '../../shared/enums/streamLinkType';
import './index.scss';

BandInfo.propTypes = {
  playerControl: PropTypes.object,

  bandInfo: PropTypes.object,
  activeTrack: PropTypes.object,
  activeWikiTrack: PropTypes.object,
  setActiveTrack: PropTypes.func,
  setIsPlaying: PropTypes.func,
  setCollapsedSongGroup: PropTypes.func,
  loadBandInfo: PropTypes.func,
};

const mapStateToProps = state => ({
  bandInfo: state.selectedBand.bandInfo,
  activeTrack: state.selectedBand.activeTrack,
  activeWikiTrack: state.selectedBand.activeWikiTrack,
});

const mapDispatchToProps = dispatch => ({
  loadBandInfo: (bandName) => dispatch(loadBandInfo(bandName)),
  setActiveTrack: (activeTrack) => dispatch(setActiveTrack(activeTrack)),
  setIsPlaying: (isPlaying) => dispatch(setIsPlaying(isPlaying)),
  setCollapsedSongGroup: (songGroupIndex, value) => dispatch(setCollapsedSongGroup(songGroupIndex, value)),
});

function BandInfo(props) {
  const { bandName } = useParams();
  const { bandInfo, loadBandInfo } = props;

  useEffect(() => {
    const loadData = async () => {
      loadBandInfo(bandName);
    };

    loadData();
  }, [loadBandInfo, bandName]);

  const handleTrackClickInDescription = (targetTrackId) => {
    const {
      activeSongGroup,
      activeSongGroupPosition,
      activeTrackPosition,
    } = getActiveSongGroupAndTrack(bandInfo.album.songGroups, targetTrackId);

    const selectedTrack = activeSongGroup.songs[activeTrackPosition];
    
    props.setActiveTrack(selectedTrack);
    props.setIsPlaying(true);
    props.playerControl.setSrc(selectedTrack.streamLinks.find(sl => sl.type === streamLinkType.HLS));
    props.playerControl.play();

    if (!selectedTrack.isMaster) {
      props.setCollapsedSongGroup(activeSongGroupPosition, true);
    }
  };

  const getWikiDescription = () => {
    if (props.activeWikiTrack) {
      const songGroup = bandInfo.album.songGroups
        .find(songGroup => songGroup.songs.find(s => s.id == props.activeWikiTrack.id));

      return songGroup.wiki;
    }

    return null;
  };

  const isPlayerVisible = () => props.activeTrack !== null;

  return bandInfo ? (
    <div className="d-flex band-info-container w-100">
      <Playlist
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
        wiki={getWikiDescription()}
        isPlayerVisible={isPlayerVisible()}
        changeTrack={handleTrackClickInDescription}
      />
    </div>
  ) : (
    <div>
      <CircularProgress />
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(BandInfo));
