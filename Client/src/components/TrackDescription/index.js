import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

TrackDescription.propTypes = {
  wiki: PropTypes.string,
  changeTrack: PropTypes.func,
};

function TrackDescription(props) {
  const { wiki, changeTrack } = props;

  const descriptionParentRef = useRef(null);

  useEffect(() => {
    if (wiki && descriptionParentRef && descriptionParentRef.current) {
      const anchors = descriptionParentRef.current.getElementsByTagName('a');

      const handleLinkClick = (event) => {
        changeTrack(event.target.dataset.trackId);
      };

      for (let anchor of anchors) {
        anchor.addEventListener('click', handleLinkClick);
      }
    }
  }, [wiki]);
  
  const getHtmlDescription = () => (
    <div
      ref={descriptionParentRef}
      className="description-text"
      dangerouslySetInnerHTML={{__html: props.wiki}}
    ></div>
  );

  return (
    <div className="col-4 offset-1 px-0 mt-3 pt-2">
      <div>
        <h5 className="mb-3 pb-2">
          TRACK HISTORY
        </h5>
      </div>

      {props.wiki !== null && getHtmlDescription()}
    </div>
  );
}

export default React.memo(TrackDescription);
