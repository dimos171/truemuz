import React from 'react';
import PropTypes from 'prop-types';
import { GiPauseButton } from "react-icons/gi";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEllipsis } from "react-icons/ai";
import { IoIosPlay } from "react-icons/io";

import { secondsToMinutesFormat } from '../../../shared/utilities';
import { streamLinkType } from '../../../shared/enums/streamLinkType';
import "./index.scss";

Track.propTypes = {
  track: PropTypes.object,
  mainVersion: PropTypes.bool,
  collapsed: PropTypes.bool,
  constainsAltervative: PropTypes.bool,
  isActiveTrack: PropTypes.bool,
  isActiveWiki: PropTypes.bool,
  isPlaying: PropTypes.bool,
  collapsedChange: PropTypes.func,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
  changeWikiTrack: PropTypes.func,
  playerControl: PropTypes.object,
};

function Track(props) {
  const handlecollapsedChange = () => props.collapsedChange(!props.collapsed);

  const getContentBasedOnAlternatives = () => props.constainsAltervative && getSortIcon();

  const handlePlayIconClick = () => {
    if (!props.isActiveTrack) {
      const link = props.track.streamLinks.find(sl => sl.type === streamLinkType.HLS);

      props.changeActiveTrack(props.track);
      props.playerControl.setSrc(link);
      props.changeWikiTrack(props.track);
      
      if (!props.isPlaying) {
        props.changeIsPlaying(!props.isPlaying);    
      }
      
      props.playerControl.play();
    } else {
      props.changeIsPlaying(!props.isPlaying);
      props.playerControl.play();
    }
  };

  const handlePauseIconClick = () => {
    props.changeIsPlaying(!props.isPlaying);
    props.playerControl.pause();
  };

  const handleWikiIconClick = () => {
    props.changeWikiTrack(props.track);
  };

  const getPausePlayIcon = () => props.isActiveTrack && props.isPlaying
    ? <GiPauseButton className="mr-2 icon" size="1.2em" onClick={handlePauseIconClick} />
    : <IoIosPlay className="mr-2 icon" size="1.2em" onClick={handlePlayIconClick} />;

  const getPausePlayTrackName = () => props.isActiveTrack && props.isPlaying
    ? <div className={"track-name text-truncate w-100 icon " + (props.mainVersion ? '' : 'ml-3')} onClick={handlePauseIconClick}>{props.track.name}</div>
    : <div className={"track-name text-truncate w-100 icon " + (props.mainVersion ? '' : 'ml-3')} onClick={handlePlayIconClick}>{props.track.name}</div>;

  const getSortIcon = () => props.collapsed
    ? <FaSortAmountUp className="mr-4 mr-xl-5 icon" onClick={handlecollapsedChange} />
    : <FaSortAmountDown className="mr-4 mr-xl-5 icon" onClick={handlecollapsedChange} />;

  const getWikiIcon = () => props.isActiveWiki
    ? <AiOutlineEye className="icon track-additional-options-icon active" size="1.3em" onClick={handleWikiIconClick}/>  
    : props.mainVersion 
      ? <AiOutlineEye className="icon track-additional-options-icon" size="1.3em" onClick={handleWikiIconClick}/>
      : <AiOutlineEllipsis className="icon track-additional-options-icon" size="1.3em"/>;

  return (
    <div className={"d-flex track-container justify-content-between" + (props.isActiveTrack && props.isPlaying ? ' active' : '')}>
      <div className="d-flex track-description align-items-center ml-5">
        {getPausePlayIcon()}
        {getPausePlayTrackName()}
      </div>

      <div className="d-flex align-items-center mr-md-4 mr-xl-5">
        {props.mainVersion && getContentBasedOnAlternatives()}

        <div className="mr-4 mr-xl-5 track-length">
          {secondsToMinutesFormat(props.track.duration)}
        </div>

        {getWikiIcon()} 
      </div>
    </div>
  );
}

export default React.memo(Track);
