import React, { useState } from 'react';
import { FaRandom } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { GiPauseButton } from "react-icons/gi";
import { FiRepeat } from "react-icons/fi";
import { IoIosVolumeHigh } from "react-icons/io";

import './index.scss';

export default function Player(props) {
  const [count, setCount] = useState(0);

  return (
    <div className="d-flex align-items-center player-container py-3 px-5">
      <div className="d-flex justify-content-end col-5 p-0">
        <FaRandom className="icon m-3" />
        <div className="col-1"></div>
        <FiRepeat className="icon m-3" />
      </div>
      <div className="d-flex justify-content-center col-2 p-0 ">
        <MdSkipPrevious className="icon m-3" size="1.3em" />
        <GiPauseButton className="icon m-3" size="1.3em" />
        <MdSkipNext className="icon m-3" size="1.3em" />
      </div>
      <div className="col-5 p-0">
        <IoIosVolumeHigh className="icon m-3" size="1.2em" />
      </div>
    </div>
  );
}
