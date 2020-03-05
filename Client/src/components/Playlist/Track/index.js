import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GiPauseButton } from "react-icons/gi";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

import "./index.scss";

Track.propTypes = {
  name: PropTypes.string,
  length: PropTypes.string,
  mainVersion: PropTypes.bool,
  collapsed: PropTypes.bool,
  constainsAltervative: PropTypes.bool,
  collapsedChange: PropTypes.func,
};

export default function Track(props) {
  const handlecollapsedChange = () => props.collapsedChange(!props.collapsed);

  const getContentBasedOnAlternatives = () => props.constainsAltervative && getSortIcon();

  const getSortIcon = () => props.collapsed
    ? <FaSortAmountUp className="mr-5 icon" onClick={handlecollapsedChange} />
    : <FaSortAmountDown className="mr-5 icon" onClick={handlecollapsedChange} />;

  return (
    <div className={"d-flex track-container justify-content-between" + (props.collapsed ? ' active' : '')}>
      <div className="d-flex align-items-center ml-5">
        <GiPauseButton className="mr-3 icon" />
        <div>
          {props.name}
        </div>
      </div>

      <div className="d-flex align-items-center mr-5">
        {props.mainVersion && getContentBasedOnAlternatives()}

        <div className="mr-5 small-title">
          {props.length}
        </div>
        
        <div className="small-title vote-btn">
          VOTE
        </div>
      </div>
    </div>
  );
}
