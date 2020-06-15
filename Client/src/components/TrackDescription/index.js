import React, { useState, useCallback } from 'react';
import { MdKeyboardArrowUp } from "react-icons/md";
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';

import './index.scss';

TrackDescription.propTypes = {
  wiki: PropTypes.string,
  isPlayerVisible: PropTypes.bool,
  isTablet: PropTypes.bool,
  changeTrack: PropTypes.func,
};

const mapSizesToProps = ({ width }) => ({
  isTablet: width < 992,
});

function TrackDescription(props) {
  const [isVisible, setIsVisible] = useState(false);

  const { wiki, changeTrack, isPlayerVisible } = props;

  const descriptionAppearsCallback = useCallback(node => {
    if (node !== null && wiki) {
      const anchors = node.getElementsByTagName('a');

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
      ref={descriptionAppearsCallback}
      className="description-text"
      dangerouslySetInnerHTML={{__html: wiki}}
    ></div>
  );

  const toggleVisibility = () => {
    document.body.style.overflowY = isVisible ? 'scroll' : 'hidden';
    setIsVisible(!isVisible);
  };

  const getDesktopLayout = () => (
    <div className="track-description-container-desktop col-12 col-lg-4 offset-lg-1 px-lg-0 mt-lg-3 pt-2 order-2">
      <div>
        <h6 className="mb-3 pb-2">
          TRACK HISTORY
        </h6>
      </div>

      {wiki !== null && getHtmlDescription()}
    </div>
  );

  const getMobileLayout = () => wiki && (
    <div className={`track-description-container-mobile text-center ${isPlayerVisible ? 'with-player' : ''} ${isVisible ? 'extended p-3 pt-4' : ''}`}>
      <div onClick={toggleVisibility}>
        <MdKeyboardArrowUp className="arrow-icon" size="1.6em" />
        <div className="track-description-container-mobile-title">HISTORY OF CREATION</div>
      </div>

      {wiki !== null && isVisible && getHtmlDescription()}
    </div>
  );

  return props.isTablet ? getMobileLayout() : getDesktopLayout();
}

export default React.memo(withSizes(mapSizesToProps)(TrackDescription));
