import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Track from '../Track';
import './index.scss';

TrackGroup.propTypes = {
  trackGroup: PropTypes.object,     
};

export default function TrackGroup(props) {
  const [ test, setTest ] = useState(0);
  const [ collapsed, setCollapsed ] = useState(false);
  const { trackGroup } = props;

  const constainsAltervative = trackGroup.alternativeTracks && trackGroup.alternativeTracks.length > 0;

  const getAlternativeTracksMarkup = () =>
    trackGroup.alternativeTracks.map((track, index) => 
      <Track
        key={index}
        name={track.name}
        length={track.length}
      />
    );

  return (
    <div className={collapsed ? 'collapsed' : ''}>
      <Track
        name={trackGroup.name}
        length={trackGroup.length}
        collapsed={collapsed}
        collapsedChange={setCollapsed}
        constainsAltervative={constainsAltervative}
        mainVersion
      />

      {constainsAltervative && (
        <CSSTransition
          in={collapsed}
          timeout={300}
          classNames="track-group"
          unmountOnExit
        >
          <div>
            {getAlternativeTracksMarkup()}
          </div>
        </CSSTransition>
      )}
    </div>
  );
}
