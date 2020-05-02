import React from 'react';
import PropTypes from 'prop-types';
import { GiPauseButton } from "react-icons/gi";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { AiOutlineEllipsis } from "react-icons/ai";
import { IoIosPlay } from "react-icons/io";

import { secondsToMinutesFormat } from '../../../shared/utilities';
import "./index.scss";

Track.propTypes = {
  track: PropTypes.object,
  mainVersion: PropTypes.bool,
  collapsed: PropTypes.bool,
  constainsAltervative: PropTypes.bool,
  isActiveTrack: PropTypes.bool,
  isPlaying: PropTypes.bool,
  collapsedChange: PropTypes.func,
  changeActiveTrack: PropTypes.func,
  changeIsPlaying: PropTypes.func,
};

export default function Track(props) {
  const handlecollapsedChange = () => props.collapsedChange(!props.collapsed);

  const getContentBasedOnAlternatives = () => props.constainsAltervative && getSortIcon();

  const handlePlayIconClick = () => {
    if (!props.isActiveTrack) {
      props.changeActiveTrack(props.track);

      if (!props.isPlaying) {
        props.changeIsPlaying(!props.isPlaying);
      }
    } else {
      props.changeIsPlaying(!props.isPlaying);
    }
  };

  const handlePauseIconClick = () => props.changeIsPlaying(!props.isPlaying);

  const getPausePlayIcon = () => props.isActiveTrack && props.isPlaying
    ? <GiPauseButton className="mr-3 icon" onClick={handlePauseIconClick} />
    : <IoIosPlay className="mr-3 icon" onClick={handlePlayIconClick} />;

  const getSortIcon = () => props.collapsed
    ? <FaSortAmountUp className="mr-5 icon" onClick={handlecollapsedChange} />
    : <FaSortAmountDown className="mr-5 icon" onClick={handlecollapsedChange} />;

  return (
    <div className={"d-flex track-container justify-content-between" + (props.collapsed ? ' active' : '')}>
      <div className="d-flex align-items-center ml-5">
        {getPausePlayIcon()}
        <div className="track-name">
          {props.track.name}
        </div>
      </div>

      <div className="d-flex align-items-center mr-5">
        {props.mainVersion && getContentBasedOnAlternatives()}

        <div className="mr-5 track-length">
          {secondsToMinutesFormat(props.track.duration)}
        </div>

        <AiOutlineEllipsis className="icon track-additional-options-icon" size="1.3em" />
      </div>
    </div>
  );
}
