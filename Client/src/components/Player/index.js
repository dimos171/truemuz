import React from 'react';
import PropTypes from 'prop-types';
import { FaRandom } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { GiPauseButton } from "react-icons/gi";
import { FiRepeat } from "react-icons/fi";
import { IoIosVolumeHigh, IoIosPlay } from "react-icons/io";

import './index.scss';

Player.propTypes = {
  isPlaying: PropTypes.bool,
  activeTrack: PropTypes.object,
  changeIsPlaying: PropTypes.func,
};

export default function Player(props) {
  const handlePlayClick = () => props.changeIsPlaying(!props.isPlaying);

  const getActiveTrackName = () => props.activeTrack
    ? props.activeTrack.name
    : '<Empty placeholder>';

  const getPausePlayIcon = () => props.isPlaying
    ? <GiPauseButton className="icon mx-3" size="1.3em" onClick={handlePlayClick} />
    : <IoIosPlay className="icon mx-3" size="1.3em" onClick={handlePlayClick} />;

  return (
    <div className="player-container px-5">
      <div className="player-container-content pt-3">
        <div className="text-center active-track">
          {getActiveTrackName()}
        </div>

        <div className="d-flex align-items-center py-3">
          <div className="d-flex justify-content-end col-5 p-0">
            <FaRandom className="icon mx-3" />
            <div className="col-1"></div>
            <FiRepeat className="icon mx-3" />
          </div>

          <div className="d-flex justify-content-center col-2 p-0 ">
            <MdSkipPrevious className="icon mx-3" size="1.3em" />
            {getPausePlayIcon()}
            <MdSkipNext className="icon mx-3" size="1.3em" />
          </div>

          <div className="col-5 p-0">
            <IoIosVolumeHigh className="icon mx-3" size="1.2em" />
          </div>
        </div>
      </div>
    </div>
  );
}
