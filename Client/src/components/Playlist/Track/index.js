import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { GiPauseButton } from "react-icons/gi";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { IoIosPlay } from "react-icons/io";

import { setActiveTrack, setIsPlaying, setActiveWikiTrack } from '../../../store/actions';
import { secondsToMinutesFormat } from '../../../shared/utilities';
import { streamLinkType } from '../../../shared/enums/streamLinkType';
import "./index.scss";

Track.propTypes = {
  track: PropTypes.object,
  playerControl: PropTypes.object,
  mainVersion: PropTypes.bool,
  collapsed: PropTypes.bool,
  constainsAltervative: PropTypes.bool,
  collapsedChange: PropTypes.func,

  activeTrack: PropTypes.object,
  activeWikiTrack: PropTypes.object,
  isPlaying: PropTypes.bool,
  setActiveTrack: PropTypes.func,
  setActiveWikiTrack: PropTypes.func,
  setIsPlaying: PropTypes.func,
};

const mapStateToProps = state => ({
  isPlaying: state.player.isPlaying,
  activeTrack: state.selectedBand.activeTrack,
  activeWikiTrack: state.selectedBand.activeWikiTrack,
});

const mapDispatchToProps = dispatch => ({
  setActiveTrack: (activeTrack) => dispatch(setActiveTrack(activeTrack)),
  setActiveWikiTrack: (activeWikiTrack) => dispatch(setActiveWikiTrack(activeWikiTrack)),
  setIsPlaying: (isPlaying) => dispatch(setIsPlaying(isPlaying)),
});

function Track(props) {
  const handlecollapsedChange = () => props.collapsedChange(!props.collapsed);

  const getContentBasedOnAlternatives = () => props.constainsAltervative && getSortIcon();

  const isActiveTrack = () => props.activeTrack != null && props.activeTrack.id === props.track.id;
  
  const isActiveWiki = () => props.activeWikiTrack != null && props.activeWikiTrack.id === props.track.id;

  const handlePlayIconClick = () => {
    if (!isActiveTrack()) {
      const link = props.track.streamLinks.find(sl => sl.type === streamLinkType.HLS);

      props.setActiveTrack(props.track);
      props.setActiveWikiTrack(props.track);
      props.playerControl.setSrc(link);

      if (!props.isPlaying) {
        props.setIsPlaying(!props.isPlaying);
      }
      
      props.playerControl.play();
    } else {
      props.setIsPlaying(!props.isPlaying);
      props.playerControl.play();
    }
  };

  const handlePauseIconClick = () => {
    props.setIsPlaying(!props.isPlaying);
    props.playerControl.pause();
  };

  const handleWikiIconClick = () => {
    props.setActiveWikiTrack(props.track);
  };

  const getPausePlayIcon = () => isActiveTrack() && props.isPlaying
    ? <GiPauseButton className="icon" size="1.2em" onClick={handlePauseIconClick} />
    : <IoIosPlay className="icon" size="1.2em" onClick={handlePlayIconClick} />;

  const getPausePlayTrackName = () => isActiveTrack() && props.isPlaying
    ? <div className={"track-name text-truncate w-100 icon pl-2 " + (props.mainVersion ? '' : 'pl-4')} onClick={handlePauseIconClick}>{props.track.name}</div>
    : <div className={"track-name text-truncate w-100 icon pl-2 " + (props.mainVersion ? '' : 'pl-4')} onClick={handlePlayIconClick}>{props.track.name}</div>;

  const getSortIcon = () => props.collapsed
    ? <FaSortAmountUp className="mr-4 mr-xl-5 icon" onClick={handlecollapsedChange} />
    : <FaSortAmountDown className="mr-4 mr-xl-5 icon" onClick={handlecollapsedChange} />;

  return (
    <div className={"d-flex track-container justify-content-between" + (isActiveTrack() && props.isPlaying ? ' active' : '')}>
      <div className="d-flex track-description align-items-center ml-5">
        {getPausePlayIcon()}
        {getPausePlayTrackName()}
      </div>

      <div className="d-flex align-items-center mr-lg-4 mr-xl-5">
        {props.mainVersion && getContentBasedOnAlternatives()}

        <div className="mr-4 mr-xl-5 track-length">
          {secondsToMinutesFormat(props.track.duration)}
        </div>

        {props.mainVersion ? (
          <AiOutlineEye
            size="1.3em"
            className={"icon track-additional-options-icon" + (isActiveWiki() ? ' active' : '')}
            onClick={handleWikiIconClick}
          />
        ) : (
          <div className="spacer"></div>
        )}
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(Track));
